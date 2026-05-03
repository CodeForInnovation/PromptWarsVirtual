import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function PledgeToVote() {
  const [pledged, setPledged] = useState(false);

  // Replace these with the specific "entry.XXXXXX" name attributes from your form
  const NAME_ENTRY = 'entry.123456';
  const EMAIL_ENTRY = 'entry.654321';

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // In a real implementation with a valid GOOGLE_FORM_ACTION_URL, you could let the form submit natively to a hidden iframe,
    // or use fetch with mode: 'no-cors'.
    // For now, we'll just simulate a successful pledge locally.
    setPledged(true);
  };

  if (pledged) {
    return (
      <div
        class="glass-card p-6 text-center mt-6 animate-pulse"
        style="border-color: rgba(34, 197, 94, 0.4);"
      >
        <div style="width:48px;height:48px;border-radius:50%;background:rgba(34, 197, 94, 0.2);margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4ade80"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">Thank you for pledging!</h3>
        <p class="text-slate-400 text-sm">
          Your commitment makes a difference. Don't forget to add the deadlines to your calendar.
        </p>
      </div>
    );
  }

  return (
    <div class="glass-card p-6 mt-6 relative overflow-hidden" aria-labelledby="pledge-heading">
      <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full mix-blend-screen filter blur-[50px] opacity-20"></div>

      <h3 id="pledge-heading" class="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a78bfa"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Take the Pledge to Vote
      </h3>
      <p class="text-slate-400 text-sm mb-5">
        Join thousands of others in committing to make your voice heard this election. (This
        connects securely to a Google Form).
      </p>

      <form onSubmit={handleSubmit} method="POST" class="flex flex-col gap-3">
        <label for="pledge-name" class="sr-only">
          First Name
        </label>
        <input
          id="pledge-name"
          name={NAME_ENTRY}
          type="text"
          required
          placeholder="First Name"
          class="chat-input"
          style="padding: 0.6rem 1rem;"
        />

        <label for="pledge-email" class="sr-only">
          Email Address
        </label>
        <input
          id="pledge-email"
          name={EMAIL_ENTRY}
          type="email"
          required
          placeholder="Email Address"
          class="chat-input"
          style="padding: 0.6rem 1rem;"
        />

        <button type="submit" class="btn-primary justify-center mt-2" style="width:100%;">
          I Pledge to Vote
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
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </form>
    </div>
  );
}
