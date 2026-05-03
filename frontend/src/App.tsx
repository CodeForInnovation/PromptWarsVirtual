import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import Roadmap from './components/Roadmap';
import QAAssistant from './components/QAAssistant';

const REGIONS: Record<string, string> = {
  CA: 'California',
  NY: 'New York',
  default: 'Other State',
};

export default function App() {
  const [region, setRegion] = useState('CA');
  const [deadlines, setDeadlines] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchDeadlines = async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const res = await fetch(`/api/deadlines?region=${region}`);
        const data = await res.json();
        setDeadlines(data.deadlines);
      } catch (e) {
        setFetchError(true);
      }
      setLoading(false);
    };
    fetchDeadlines();
  }, [region]);

  return (
    <div class="bg-gradient-animated min-h-screen relative">
      {/* Background decorative glows — hidden from AT */}
      <div class="hero-glow bg-indigo-500" style="top: -100px; left: -100px;" aria-hidden="true" />
      <div class="hero-glow bg-violet-600" style="top: 200px; right: -150px;" aria-hidden="true" />

      <div class="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">

        {/* ── Header ─────────────────────────────────────── */}
        <header role="banner">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
              aria-hidden="true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span class="text-slate-400 text-sm font-medium tracking-widest uppercase" aria-hidden="true">CivicGuide</span>
          </div>

          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3">
            Your <span class="gradient-text">Election Roadmap</span>
          </h1>
          <p class="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Stay on top of every deadline. From registration to election day — we've got your civic journey covered.
          </p>

          {/* Region selector */}
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <label for="region-select" class="text-slate-400 text-sm font-medium">
              Viewing deadlines for:
            </label>
            <select
              id="region-select"
              value={region}
              onChange={(e) => setRegion((e.target as HTMLSelectElement).value)}
              class="region-select"
              aria-describedby="region-hint"
            >
              {Object.entries(REGIONS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <span id="region-hint" class="sr-only">
              Selecting a region will update the election timeline deadlines below.
            </span>
            <div
              class="badge"
              style="background: rgba(99,102,241,0.15); color: #818cf8; border: 1px solid rgba(99,102,241,0.25);"
              aria-label="Live data"
              role="status"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="12" r="8"/>
              </svg>
              Live
            </div>
          </div>
        </header>

        {/* ── Main content ───────────────────────────────── */}
        <main id="main-content" class="grid lg:grid-cols-2 gap-6 mt-10" tabIndex={-1}>

          {/* Election Timeline */}
          <section aria-labelledby="timeline-heading">
            <h2 id="timeline-heading" class="sr-only">Election Timeline for {REGIONS[region]}</h2>
            {loading ? (
              <div
                class="glass-card p-6 space-y-5"
                role="status"
                aria-live="polite"
                aria-label={`Loading deadlines for ${REGIONS[region]}`}
              >
                {[1,2,3].map(i => (
                  <div key={i} class="flex gap-4 animate-pulse" aria-hidden="true">
                    <div class="w-9 h-9 rounded-full bg-white/10 shrink-0"/>
                    <div class="flex-1 space-y-2">
                      <div class="h-4 bg-white/10 rounded w-3/4"/>
                      <div class="h-3 bg-white/10 rounded w-1/2"/>
                    </div>
                  </div>
                ))}
                <span class="sr-only">Loading election deadlines, please wait.</span>
              </div>
            ) : fetchError ? (
              <div class="glass-card p-6 text-center" role="alert" aria-live="assertive">
                <p style="color:#f87171; font-weight:600; margin-bottom:0.25rem;">Failed to load deadlines</p>
                <p class="text-slate-400 text-sm">Please refresh the page or try selecting a different region.</p>
              </div>
            ) : deadlines ? (
              <Roadmap region={region} deadlines={deadlines} regionLabel={REGIONS[region]} />
            ) : null}
          </section>

          {/* Q&A Assistant */}
          <section aria-labelledby="qa-heading">
            <h2 id="qa-heading" class="sr-only">Election Q&amp;A Assistant</h2>
            <QAAssistant />
          </section>
        </main>

        {/* ── Footer ─────────────────────────────────────── */}
        <footer role="contentinfo" class="mt-12 text-center" style="color: #475569; font-size: 0.75rem;">
          <p>
            CivicGuide is an educational tool.{' '}
            <a
              href="https://www.usa.gov/election-office"
              target="_blank"
              rel="noopener noreferrer"
              style="color: #818cf8; text-decoration: underline;"
              aria-label="Visit USA.gov for official election information (opens in a new tab)"
            >
              Verify with your official state election website.
            </a>
          </p>
        </footer>

      </div>
    </div>
  );
}
