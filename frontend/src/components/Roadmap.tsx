import { h } from 'preact';
import GoogleCalendarButton from './GoogleCalendarButton';

interface Deadlines {
  registration: string;
  primary: string;
  general: string;
}

interface RoadmapProps {
  deadlines: Deadlines;
  region: string;
  regionLabel: string;
}

const STEP_CONFIG = [
  {
    key: 'registration' as keyof Deadlines,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    label: 'Voter Registration',
    description: 'Deadline to register to vote in your state. First and most critical step.',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59,130,246,0.4)',
    badge: 'Step 1',
    badgeBg: 'rgba(59,130,246,0.15)',
    badgeColor: '#60a5fa',
  },
  {
    key: 'primary' as keyof Deadlines,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    label: 'Primary Election',
    description: "Vote to select your party's nominee for the general election.",
    gradient: 'from-violet-500 to-purple-500',
    glow: 'rgba(139,92,246,0.4)',
    badge: 'Step 2',
    badgeBg: 'rgba(139,92,246,0.15)',
    badgeColor: '#a78bfa',
  },
  {
    key: 'general' as keyof Deadlines,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    label: 'General Election',
    description: 'The final election day. Make your voice count!',
    gradient: 'from-rose-500 to-pink-500',
    glow: 'rgba(244,63,94,0.4)',
    badge: 'Step 3',
    badgeBg: 'rgba(244,63,94,0.15)',
    badgeColor: '#fb7185',
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function daysUntil(dateStr: string): number | null {
  const target = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function Roadmap({ deadlines, regionLabel }: RoadmapProps) {
  return (
    <div class="glass-card p-6">
      {/* Header */}
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-bold text-white">Election Timeline</h2>
          <p class="text-slate-500 text-sm mt-0.5">{regionLabel}</p>
        </div>
        <div class="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
      </div>

      {/* Steps */}
      <div>
        {STEP_CONFIG.map((step, i) => {
          const date = deadlines[step.key];
          const days = daysUntil(date);
          const isPast = days !== null && days < 0;
          const isSoon = days !== null && days >= 0 && days <= 30;

          return (
            <div
              key={step.key}
              class="timeline-step"
              style={i === STEP_CONFIG.length - 1 ? 'padding-bottom:0' : ''}
            >
              {/* Dot */}
              <div
                class="timeline-dot"
                style={`background: linear-gradient(135deg, ${step.gradient.replace('from-', '').replace(' to-', '').split(' ')[0]}, ${step.gradient.split(' ').pop()}); box-shadow: 0 0 20px ${step.glow}; border: none; color: white;`}
              >
                {isPast ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span style="font-size:0.75rem; font-weight:700">{i + 1}</span>
                )}
              </div>

              {/* Content */}
              <div
                class="group"
                style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1rem 1.1rem; transition: all 0.3s ease; cursor: default;"
              >
                <div class="flex items-start justify-between gap-3 flex-wrap">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        class="badge"
                        style={`background: ${step.badgeBg}; color: ${step.badgeColor}; border: 1px solid ${step.badgeBg.replace('0.15', '0.3')}`}
                      >
                        {step.icon}
                        {step.badge}
                      </span>
                      {isPast && (
                        <span
                          class="badge"
                          style="background: rgba(148,163,184,0.1); color: #64748b; border: 1px solid rgba(148,163,184,0.2)"
                        >
                          Passed
                        </span>
                      )}
                      {isSoon && !isPast && (
                        <span
                          class="badge"
                          style="background: rgba(234,179,8,0.15); color: #facc15; border: 1px solid rgba(234,179,8,0.25)"
                        >
                          ⚡ Soon
                        </span>
                      )}
                    </div>
                    <h3 class="font-semibold text-white text-sm mb-1">{step.label}</h3>
                    <p class="text-slate-500 text-xs leading-relaxed">{step.description}</p>
                  </div>
                  <div class="text-right shrink-0">
                    <div class="text-xs font-bold" style={`color: ${step.badgeColor}`}>
                      {formatDate(date)}
                    </div>
                    {!isPast && days !== null && (
                      <div class="text-slate-600 text-xs mt-0.5">
                        {days === 0 ? 'Today!' : `${days}d away`}
                      </div>
                    )}
                  </div>
                </div>
                <div class="mt-2 pt-2" style="border-top: 1px solid rgba(255,255,255,0.05)">
                  <GoogleCalendarButton
                    title={step.label}
                    date={date}
                    description={`CivicGuide reminder: ${step.description}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
