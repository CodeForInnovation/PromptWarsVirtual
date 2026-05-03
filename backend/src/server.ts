import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/api';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;

// Trust the first proxy (Cloud Run) so rate limiting uses the correct client IP
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://translate.googleapis.com", "https://translate.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://translate.googleapis.com", "https://translate.google.com"],
      imgSrc: ["'self'", "data:", "https:", "https://translate.googleapis.com", "https://translate.google.com", "https://www.gstatic.com"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com", "https://translate.googleapis.com"],
      frameSrc: ["https://www.youtube.com", "https://youtube.com"],
    },
  },
}));

// Strict CORS: Only allow our Cloud Run URL and localhost
const allowedOrigins = [
  'https://civicguide-687579320432.us-central1.run.app',
  'http://localhost:8080'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST']
}));

// Prevent large payload DoS attacks
app.use(express.json({ limit: '10kb' }));

// Rate Limiting: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// API Routes
app.use('/api', apiRoutes);

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; // For testing
