import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import apiRoutes from '../src/routes/api';
import * as geminiService from '../src/services/gemini.service';

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

// Mock the Gemini service
vi.mock('../src/services/gemini.service', () => ({
  askGemini: vi.fn(),
}));

describe('API Routes', () => {
  describe('GET /api/deadlines', () => {
    it('should return default deadlines if no region is provided', async () => {
      const res = await request(app).get('/api/deadlines');
      expect(res.status).toBe(200);
      expect(res.body.region).toBe('default');
      expect(res.body.deadlines.registration).toBe('2024-10-01');
    });

    it('should return specific deadlines for CA', async () => {
      const res = await request(app).get('/api/deadlines?region=CA');
      expect(res.status).toBe(200);
      expect(res.body.region).toBe('CA');
      expect(res.body.deadlines.registration).toBe('2024-10-21');
    });
  });

  describe('POST /api/qa', () => {
    it('should return 400 if query is missing', async () => {
      const res = await request(app).post('/api/qa').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Query is required');
    });

    it('should return answer for valid query and sanitize XSS', async () => {
      vi.mocked(geminiService.askGemini).mockResolvedValue('Yes, you need an ID.');

      const res = await request(app)
        .post('/api/qa')
        .send({ query: 'Do I need an ID? <script>alert("xss")</script>' });

      expect(res.status).toBe(200);
      expect(res.body.answer).toBe('Yes, you need an ID.');

      // Check that the script tag was sanitized before sending to Gemini
      expect(geminiService.askGemini).toHaveBeenCalledWith('Do I need an ID? ');
    });

    it('should return 500 if gemini service fails', async () => {
      vi.mocked(geminiService.askGemini).mockRejectedValue(new Error('API Error'));

      const res = await request(app).post('/api/qa').send({ query: 'How to vote?' });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to process request');
    });
  });
});
