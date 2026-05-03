import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED = ['Do I need an ID to vote?', 'Can I vote by mail?', 'What is Election Day?'];

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

export default function QAAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm CivicGuide — your AI assistant for all things elections. Ask me anything about voting requirements, deadlines, or how the process works.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  const scrollToBottom = () => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (query: string) => {
    if (!query.trim() || isLoading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: query }]);
    setIsLoading(true);
    setLiveAnnouncement('');

    try {
      const response = await fetch('/api/qa', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || ''
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      const answer = response.ok ? data.answer : 'Sorry, I encountered an error. Please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
      setLiveAnnouncement(answer);
    } catch {
      const errMsg = 'Network error. Please try again.';
      setMessages((prev) => [...prev, { role: 'assistant', content: errMsg }]);
      setLiveAnnouncement(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div
      class="glass-card flex flex-col overflow-hidden"
      style="height: 560px;"
      role="region"
      aria-label="CivicGuide AI Q&A Assistant"
    >
      {/* Hidden aria-live region */}
      <div aria-live="polite" aria-atomic="true" class="sr-only" role="status">
        {liveAnnouncement}
      </div>

      {/* Header */}
      <div style="background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15)); border-bottom: 1px solid rgba(255,255,255,0.07); padding: 1rem 1.25rem;">
        <div class="flex items-center gap-3">
          <div
            style="width:36px; height:36px; border-radius:10px; background: linear-gradient(135deg,#6366f1,#8b5cf6); display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 15px rgba(99,102,241,0.4);"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p class="text-white font-semibold text-sm" id="qa-assistant-title">
              CivicGuide AI
            </p>
            <div class="flex items-center gap-1.5 mt-0.5" aria-hidden="true">
              <span
                style="width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block;box-shadow:0 0 6px #22c55e;"
                aria-hidden="true"
              />
              <span style="color:#4ade80; font-size:0.7rem; font-weight:500;">
                Powered by Gemini
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Message list */}
      <div
        class="flex-1 overflow-y-auto p-4 space-y-3"
        role="log"
        aria-label="Conversation history"
        aria-live="off"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            class={`flex message-animate ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div
                style="width:28px; height:28px; border-radius:8px; background: linear-gradient(135deg,#6366f1,#8b5cf6); display:flex; align-items:center; justify-content:center; margin-right:8px; flex-shrink:0; margin-top:2px;"
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  stroke-width="2.5"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
            )}
            <div
              class="max-w-[78%] text-sm leading-relaxed"
              style={
                msg.role === 'user'
                  ? 'background: linear-gradient(135deg,#6366f1,#7c3aed); color:white; padding: 0.6rem 1rem; border-radius: 16px 16px 4px 16px;'
                  : 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; padding: 0.6rem 1rem; border-radius: 4px 16px 16px 16px;'
              }
              aria-label={`${msg.role === 'user' ? 'You' : 'CivicGuide'}: ${msg.content}`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div
            class="flex justify-start message-animate"
            role="status"
            aria-label="CivicGuide is thinking"
          >
            <div
              style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;margin-right:8px;flex-shrink:0;"
              aria-hidden="true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2.5"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); padding: 0.7rem 1rem; border-radius: 4px 16px 16px 16px; display:flex; align-items:center; gap:4px;">
              <span class="typing-dot" aria-hidden="true" />
              <span class="typing-dot" aria-hidden="true" />
              <span class="typing-dot" aria-hidden="true" />
              <span class="sr-only">CivicGuide is thinking…</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Suggested questions */}
      {messages.length === 1 && (
        <nav
          aria-label="Suggested questions"
          style="padding: 0 1rem 0.5rem; display:flex; flex-wrap:wrap; gap:0.4rem;"
        >
          {SUGGESTED.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              class="suggested-btn"
              aria-label={`Ask: ${s}`}
              type="button"
            >
              {s}
            </button>
          ))}
        </nav>
      )}

      {/* Input form */}
      <div style="padding: 0.75rem 1rem; border-top: 1px solid rgba(255,255,255,0.06);">
        <form
          onSubmit={handleSubmit}
          class="flex gap-2 items-center"
          aria-label="Send a question to CivicGuide"
          noValidate
        >
          <label for="chat-input" class="sr-only">
            Type your election question here
          </label>
          <input
            id="chat-input"
            type="text"
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            placeholder="Ask about voting, registration, deadlines…"
            class="chat-input flex-1"
            aria-label="Your question"
            aria-describedby="chat-hint"
            aria-required="true"
            disabled={isLoading}
            maxLength={500}
            autoComplete="off"
          />
          <span id="chat-hint" class="sr-only">
            Type a question and press Enter or click Send to get an answer from CivicGuide AI.
          </span>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            class="btn-primary"
            style="padding: 0.65rem 0.9rem; border-radius:10px; min-width:42px;"
            aria-label={isLoading ? 'Sending message, please wait' : 'Send message'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
