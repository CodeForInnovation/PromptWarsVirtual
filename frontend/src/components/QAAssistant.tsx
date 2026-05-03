import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED = [
  'Do I need an ID to vote?',
  'Can I vote by mail?',
  'What is Election Day?',
];

export default function QAAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m CivicGuide — your AI assistant for all things elections. Ask me anything about voting requirements, deadlines, or how the process works.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async (query: string) => {
    if (!query.trim() || isLoading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.ok ? data.answer : 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div class="glass-card flex flex-col overflow-hidden" style="height: 560px;">
      {/* Header */}
      <div style="background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15)); border-bottom: 1px solid rgba(255,255,255,0.07); padding: 1rem 1.25rem;">
        <div class="flex items-center gap-3">
          <div style="width:36px; height:36px; border-radius:10px; background: linear-gradient(135deg,#6366f1,#8b5cf6); display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 15px rgba(99,102,241,0.4);">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <p class="text-white font-semibold text-sm">CivicGuide AI</p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span style="width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block;box-shadow:0 0 6px #22c55e;"/>
              <span style="color:#4ade80; font-size:0.7rem; font-weight:500;">Powered by Gemini</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div class="flex-1 overflow-y-auto p-4 space-y-3" style="background: transparent;">
        {messages.map((msg, idx) => (
          <div key={idx} class={`flex message-animate ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div style="width:28px; height:28px; border-radius:8px; background: linear-gradient(135deg,#6366f1,#8b5cf6); display:flex; align-items:center; justify-content:center; margin-right:8px; flex-shrink:0; margin-top:2px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
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
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div class="flex justify-start message-animate">
            <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;margin-right:8px;flex-shrink:0;">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); padding: 0.7rem 1rem; border-radius: 4px 16px 16px 16px; display:flex; align-items:center; gap:4px;">
              <span class="typing-dot"/>
              <span class="typing-dot"/>
              <span class="typing-dot"/>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions (only show when no user messages) */}
      {messages.length === 1 && (
        <div style="padding: 0 1rem 0.5rem; display:flex; flex-wrap:wrap; gap:0.4rem;">
          {SUGGESTED.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              style="font-size:0.72rem; padding:0.3rem 0.7rem; border-radius:9999px; border:1px solid rgba(99,102,241,0.35); background: rgba(99,102,241,0.1); color: #818cf8; cursor:pointer; transition: all 0.2s; font-family: inherit;"
              onMouseOver={(e: any) => { e.target.style.background = 'rgba(99,102,241,0.2)'; }}
              onMouseOut={(e: any) => { e.target.style.background = 'rgba(99,102,241,0.1)'; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style="padding: 0.75rem 1rem; border-top: 1px solid rgba(255,255,255,0.06);">
        <form onSubmit={handleSubmit} class="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onInput={(e) => setInput((e.target as HTMLInputElement).value)}
            placeholder="Ask about voting, registration, deadlines…"
            class="chat-input flex-1"
            aria-label="Ask a question about elections"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            class="btn-primary"
            style="padding: 0.65rem 0.9rem; border-radius:10px; min-width:42px;"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
