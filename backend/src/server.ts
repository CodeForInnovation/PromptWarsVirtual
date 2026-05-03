import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import * as TraceAgent from '@google-cloud/trace-agent';
import { ErrorReporting } from '@google-cloud/error-reporting';
import apiRoutes from './routes/api';

// Initialize Google Cloud Observability
if (process.env.NODE_ENV === 'production') {
  TraceAgent.start();
}
const errorReporting = new ErrorReporting();

const app = express();
const PORT = process.env.PORT || 8080;

// Trust the first proxy (Cloud Run) so rate limiting uses the correct client IP
app.set('trust proxy', 1);

// Body parsing & Cookies
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Middleware to generate a nonce for CSP
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-eval'", // Required for Google Translate widget
          (req: express.Request, res: express.Response) => `'nonce-${res.locals.nonce}'`,
          'https://translate.googleapis.com',
          'https://translate.google.com',
          'https://translate-pa.googleapis.com',
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // Often needed for dynamic styling libraries
          'https://translate.googleapis.com',
          'https://translate.google.com',
          'https://fonts.googleapis.com',
          'https://www.gstatic.com',
        ],
        imgSrc: [
          "'self'",
          'data:',
          'https:',
          'https://translate.googleapis.com',
          'https://translate.google.com',
          'https://www.gstatic.com',
        ],
        connectSrc: [
          "'self'",
          'https://generativelanguage.googleapis.com',
          'https://translate.googleapis.com',
        ],
        frameSrc: ['https://www.youtube.com', 'https://youtube.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      },
    },
  })
);

// Enable gzip compression
app.use(compression());

// Strict CORS
const allowedOrigins = [
  'https://civicguide-687579320432.us-central1.run.app',
  'http://localhost:8080',
  'http://localhost:5173',
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
  })
);

// CSRF Protection
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

// Middleware to set XSRF-TOKEN cookie
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    httpOnly: false, // Must be readable by frontend to send in header
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  next();
});

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
app.use('/api', apiRoutes);

// Error Reporting
app.use(errorReporting.express);

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../frontend/dist');
  const indexPath = path.join(distPath, 'index.html');
  
  app.use(
    express.static(distPath, {
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.match(/\.(png|jpg|jpeg|gif|svg|ico|woff2?)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      },
    })
  );

  app.get(/.*/, (req, res) => {
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading index.html:', err);
        return res.status(500).send('Internal Server Error');
      }
      const html = data.replace(/{{NONCE}}/g, res.locals.nonce);
      res.send(html);
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
