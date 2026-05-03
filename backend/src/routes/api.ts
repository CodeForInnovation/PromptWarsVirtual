import { Router, Request, Response } from 'express';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { askGemini } from '../services/gemini.service';

const router = Router();
const window = new JSDOM('').window;
const purify = DOMPurify(window);

interface DeadlineInfo {
  registration: string;
  primary: string;
  general: string;
}

const DEADLINES: Record<string, DeadlineInfo> = {
  CA: {
    registration: '2024-10-21',
    primary: '2024-03-05',
    general: '2024-11-05',
  },
  NY: {
    registration: '2024-10-26',
    primary: '2024-06-25',
    general: '2024-11-05',
  },
  default: {
    registration: '2024-10-01',
    primary: '2024-05-01',
    general: '2024-11-05',
  },
};

// Mock Deadlines API
router.get('/deadlines', (req: Request, res: Response) => {
  const region = (req.query.region as string) || 'default';
  const selectedDeadlines = DEADLINES[region] || DEADLINES['default'];
  
  res.json({ region, deadlines: selectedDeadlines });
});

// Q&A endpoint
router.post('/qa', async (req: Request, res: Response) => {
  try {
    const rawQuery = req.body.query;
    if (!rawQuery) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Sanitize input
    const sanitizedQuery = purify.sanitize(rawQuery);

    const answer = await askGemini(sanitizedQuery);
    res.json({ answer });
  } catch (error) {
    // Structured error log for Cloud Logging
    console.error(JSON.stringify({
      message: 'Error in Q&A endpoint',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      severity: 'ERROR'
    }));
    res.status(500).json({ error: 'Failed to process request' });
  }
});

export default router;
