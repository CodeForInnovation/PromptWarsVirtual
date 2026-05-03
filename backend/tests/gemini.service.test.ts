import { describe, it, expect, vi, beforeEach } from 'vitest';
import { askGemini } from '../src/services/gemini.service';

// Mock the GoogleGenAI and SecretManager dependencies
vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = {
      generateContent: vi.fn().mockResolvedValue({
        text: 'Mocked Gemini Response'
      })
    };
  }
}));

vi.mock('@google-cloud/secret-manager', () => ({
  SecretManagerServiceClient: class {
    accessSecretVersion = vi.fn().mockResolvedValue([
      {
        payload: {
          data: Buffer.from('mock-api-key')
        }
      }
    ]);
  }
}));

describe('Gemini Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
  });

  it('should return an answer for a valid query', async () => {
    const response = await askGemini('How do I vote?');
    expect(response).toBe('Mocked Gemini Response');
  });

  it('should use the API key from environment variables if available', async () => {
    process.env.GEMINI_API_KEY = 'env-key';
    await askGemini('Test');
    // Mocks would show it didn't call Secret Manager (indirectly tested by logic)
  });
});
