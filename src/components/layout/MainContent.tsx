type Match = {
  id: string;
  home: string;
  away: string;
  league: string;
  date: string;
  odds: { home: number; draw: number; away: number };
};

export default function MainContent() {
  const matches: Match[] = [
    {
      id: "m1",
      home: "FC Aurora",
      away: "Rival United",
      league: "Championship League",
      date: "2025-09-30 20:45",
      odds: { home: 1.85, draw: 3.40, away: 4.20 },
    },
    {
      id: "m2",
      home: "North City",
      away: "Southern Stars",
      league: "Premier Division",
      date: "2025-10-01 18:30",
      odds: { home: 2.05, draw: 3.10, away: 3.60 },
    },
    {
      id: "m3",
      home: "Blue Harbor",
      away: "Highland FC",
      league: "National Cup",
      date: "2025-10-02 21:00",
      odds: { home: 1.95, draw: 3.25, away: 3.90 },
    },
  ];

  return (
    <div className="min-h-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {matches.map(match => (
          <SimpleMatchCard key={match.id} match={match} />)
        )}
      </div>
    </div>
  );
}

function SimpleMatchCard({ match }: { match: Match }) {
  return (
    <article className="rounded-2xl border border-neutral-600/40 bg-[linear-gradient(180deg,#0a0a0a,#15171c)] p-5 shadow-[0_8px_30px_rgba(189,189,189,0.08)] hover:shadow-[0_12px_40px_rgba(21,94,117,0.14)] transition">
      <header className="mb-4">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-cyan-neutral-950 text-neutral-200 border border-neutral-200/40">
            {match.league}
          </span>
          <span className="text-[11px] text-zinc-400">{match.date}</span>
        </div>
        <div className="mt-3 grid grid-cols-[1fr,auto,1fr] items-center gap-2 text-base font-bold text-zinc-100">
          <span className="text-right truncate">{match.home}</span>
          <span className="px-2 text-cyan-900">vs</span>
          <span className="text-left truncate">{match.away}</span>
        </div>
      </header>
      <div className="grid grid-cols-3 gap-3">
        <OddBtn label="1" value={match.odds.home} />
        <OddBtn label="X" value={match.odds.draw} />
        <OddBtn label="2" value={match.odds.away} />
      </div>
    </article>
  );
}

function OddBtn({ label, value }: { label: string; value: number }) {
  return (
    <button className="w-full rounded-lg bg-gradient-to-b from-[#0a1724] to-[#0f2236] hover:from-[#0e2234] hover:to-[#14314d] border border-cyan-900/40 text-zinc-100 text-sm font-semibold py-2.5 transition shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
      <span className="mr-1 text-cyan-700">{label}</span>
      <span className="tracking-wide">{value.toFixed(2)}</span>
    </button>
  );
}
