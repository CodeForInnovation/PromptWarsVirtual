import { h } from 'preact';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QAAssistant from '../QAAssistant';

// Mock the global fetch
vi.stubGlobal('fetch', vi.fn());

// Helper: set an input value and fire the onInput event so Preact state updates
function setInputValue(el: HTMLInputElement, value: string) {
  Object.defineProperty(el, 'value', { configurable: true, value });
  fireEvent.input(el);
}

describe('QAAssistant Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render the chat interface', () => {
    render(<QAAssistant />);
    expect(screen.getByPlaceholderText('Ask about voting, registration, deadlines…')).toBeDefined();
    expect(screen.getByRole('button', { name: /send message/i })).toBeDefined();
    expect(screen.getByText(/Hi! I'm CivicGuide/)).toBeDefined();
  });

  it('should have submit button disabled when input is empty', () => {
    render(<QAAssistant />);
    const submitButton = screen.getByRole('button', { name: /send message/i });
    expect((submitButton as HTMLButtonElement).disabled).toBe(true);
  });

  it('should enable submit button when input has text', async () => {
    render(<QAAssistant />);
    const input = screen.getByPlaceholderText('Ask about voting, registration, deadlines…') as HTMLInputElement;

    await act(async () => {
      setInputValue(input, 'Can I vote early?');
    });

    const submitButton = screen.getByRole('button', { name: /send message/i });
    expect((submitButton as HTMLButtonElement).disabled).toBe(false);
  });

  it('should send a query and display the response', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ answer: 'Yes, you can vote early in California.' }),
    });

    render(<QAAssistant />);

    const input = screen.getByPlaceholderText('Ask about voting, registration, deadlines…') as HTMLInputElement;

    await act(async () => {
      setInputValue(input, 'Can I vote early?');
    });

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Wait for the response to be rendered (aria-live + message bubble both show text)
    await waitFor(() => {
      const matches = screen.getAllByText('Yes, you can vote early in California.');
      expect(matches.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });
});
