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

  useEffect(() => {
    const fetchDeadlines = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/deadlines?region=${region}`);
        const data = await res.json();
        setDeadlines(data.deadlines);
      } catch (e) {
        console.error('Failed to fetch deadlines');
      }
      setLoading(false);
    };
    fetchDeadlines();
  }, [region]);

  return (
    <div class="bg-gradient-animated min-h-screen relative">
      {/* Background glows */}
      <div class="hero-glow bg-indigo-500" style="top: -100px; left: -100px;" />
      <div class="hero-glow bg-violet-600" style="top: 200px; right: -150px;" />

      <div class="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header class="mb-10">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span class="text-slate-400 text-sm font-medium tracking-widest uppercase">CivicGuide</span>
          </div>

          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-3">
            Your <span class="gradient-text">Election Roadmap</span>
          </h1>
          <p class="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Stay on top of every deadline. From registration to election day — we've got your civic journey covered.
          </p>

          {/* Region selector */}
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <span class="text-slate-500 text-sm font-medium">Viewing deadlines for:</span>
            <div class="relative">
              <select
                id="region-select"
                value={region}
                onChange={(e) => setRegion((e.target as HTMLSelectElement).value)}
                class="region-select"
                aria-label="Select your state"
              >
                {Object.entries(REGIONS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div class="badge" style="background: rgba(99,102,241,0.15); color: #818cf8; border: 1px solid rgba(99,102,241,0.25);">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8"/>
              </svg>
              Live
            </div>
          </div>
        </header>

        {/* Main content */}
        <main class="grid lg:grid-cols-2 gap-6">
          {/* Roadmap */}
          <section aria-label="Election Timeline">
            {loading ? (
              <div class="glass-card p-6 space-y-5">
                {[1,2,3].map(i => (
                  <div key={i} class="flex gap-4 animate-pulse">
                    <div class="w-9 h-9 rounded-full bg-white/10 shrink-0"/>
                    <div class="flex-1 space-y-2">
                      <div class="h-4 bg-white/10 rounded w-3/4"/>
                      <div class="h-3 bg-white/10 rounded w-1/2"/>
                    </div>
                  </div>
                ))}
              </div>
            ) : deadlines ? (
              <Roadmap region={region} deadlines={deadlines} regionLabel={REGIONS[region]} />
            ) : (
              <div class="glass-card p-6 text-slate-400 text-center">Failed to load deadlines.</div>
            )}
          </section>

          {/* Q&A */}
          <section aria-label="Election Q&A Assistant">
            <QAAssistant />
          </section>
        </main>

        {/* Footer */}
        <footer class="mt-12 text-center text-slate-600 text-xs">
          <p>CivicGuide is an educational tool. Always verify with your official state election website.</p>
        </footer>
      </div>
    </div>
  );
}
