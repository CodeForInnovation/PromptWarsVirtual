import { h } from 'preact';

interface CalendarProps {
  title: string;
  date: string;
  description?: string;
}

export default function GoogleCalendarButton({ title, date, description = '' }: CalendarProps) {
  const formatted = date.replace(/-/g, '');
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatted}T090000Z/${formatted}T180000Z&details=${encodeURIComponent(description)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style="display:inline-flex; align-items:center; gap:0.35rem; font-size:0.72rem; font-weight:600; color:#818cf8; text-decoration:none; padding:0.25rem 0.6rem; border-radius:6px; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2); transition:all 0.2s;"
      aria-label={`Add ${title} to Google Calendar`}
      onMouseOver={(e: any) => { e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
      onMouseOut={(e: any) => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      Add to Calendar
    </a>
  );
}
