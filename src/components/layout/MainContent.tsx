import { useSportContext } from "@/context/SportContext";
import { OddsData } from "@/services/api";
import { ScrollArea } from "@/components/ui/scroll-area";

// Przykładowe mecze dla strony głównej
const sampleMatches: OddsData[] = [
  {
    id: "sample-1",
    home: "Manchester United",
    away: "Liverpool FC",
    league: "Premier League",
    date: "2025-01-15T20:00:00",
    odds: {
      home: 2.10,
      draw: 3.40,
      away: 3.20
    }
  },
  {
    id: "sample-2", 
    home: "FC Barcelona",
    away: "Real Madrid",
    league: "La Liga",
    date: "2025-01-16T21:00:00",
    odds: {
      home: 1.95,
      draw: 3.60,
      away: 3.80
    }
  },
  {
    id: "sample-3",
    home: "Bayern Munich",
    away: "Borussia Dortmund",
    league: "Bundesliga",
    date: "2025-01-17T18:30:00",
    odds: {
      home: 1.75,
      draw: 3.80,
      away: 4.50
    }
  },
  {
    id: "sample-4",
    home: "PSG",
    away: "Marseille",
    league: "Ligue 1",
    date: "2025-01-18T20:45:00",
    odds: {
      home: 1.60,
      draw: 4.20,
      away: 5.50
    }
  },
  {
    id: "sample-5",
    home: "Juventus",
    away: "AC Milan",
    league: "Serie A",
    date: "2025-01-19T19:30:00",
    odds: {
      home: 2.30,
      draw: 3.20,
      away: 3.10
    }
  },
  {
    id: "sample-6",
    home: "Arsenal",
    away: "Chelsea",
    league: "Premier League",
    date: "2025-01-20T17:00:00",
    odds: {
      home: 2.00,
      draw: 3.50,
      away: 3.60
    }
  }
];

export default function MainContent() {
  const { selectedSport, selectedSportTitle, oddsData, isLoading, error } = useSportContext();

  if (error) {
    return (
      <ScrollArea className="h-full w-full">
        <div className="min-h-full p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-2">⚠️</div>
            <p className="text-red-400 text-lg font-semibold">{error}</p>
            <p className="text-neutral-400 mt-2">Spróbuj ponownie lub wybierz inny sport</p>
          </div>
        </div>
      </ScrollArea>
    );
  }

  if (isLoading) {
    return (
      <ScrollArea className="h-full w-full">
        <div className="min-h-full p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-neutral-300 text-lg">Ładowanie danych...</p>
          </div>
        </div>
      </ScrollArea>
    );
  }

  if (!selectedSport) {
    // Strona główna - wyświetl przykładowe mecze
    return (
      <ScrollArea className="h-full w-full">
        <div className="min-h-full p-4">
          {/* Sekcja promocji */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-4 text-white">
                <h3 className="font-bold text-lg mb-2">🎁 Bonus powitalny</h3>
                <p className="text-sm opacity-90">Otrzymaj 100% bonus do 500 zł na pierwszy depozyt</p>
              </div>
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 text-white">
                <h3 className="font-bold text-lg mb-2">⚡ Cashback</h3>
                <p className="text-sm opacity-90">Do 10% zwrotu z każdego zakładu każdego dnia</p>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white">
                <h3 className="font-bold text-lg mb-2">🏆 VIP Program</h3>
                <p className="text-sm opacity-90">Ekskluzywne bonusy i osobisty menedżer konta</p>
              </div>
            </div>
          </div>

          {/* Sekcja meczów */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-100 mb-2">Najpopularniejsze mecze</h1>
            <p className="text-neutral-400">Wybierz sport z menu bocznego, aby zobaczyć więcej opcji</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sampleMatches.map((match) => (
              <SimpleMatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </ScrollArea>
    );
  }

  if (oddsData.length === 0) {
    return (
      <ScrollArea className="h-full w-full">
        <div className="min-h-full p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-neutral-400 text-4xl mb-4">📅</div>
            <h2 className="text-xl font-semibold text-neutral-200 mb-2">{selectedSportTitle}</h2>
            <p className="text-neutral-400">Brak dostępnych meczy dla tego sportu</p>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="min-h-full p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-100 mb-2">{selectedSportTitle}</h1>
          <p className="text-neutral-400">{oddsData.length} dostępnych meczy</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {oddsData.map((match, index) => (
            <SimpleMatchCard key={match.id || `match-${index}`} match={match} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

function SimpleMatchCard({ match }: { match: OddsData }) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <article className="rounded-2xl border border-neutral-600/40 bg-[linear-gradient(180deg,#0a0a0a,#15171c)] p-5 shadow-[0_8px_30px_rgba(189,189,189,0.08)] hover:shadow-[0_12px_40px_rgba(21,94,117,0.14)] transition">
      <header className="mb-4">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-cyan-neutral-950 text-neutral-200 border border-neutral-200/40">
            {match.league}
          </span>
          <span className="text-[11px] text-zinc-400">{formatDate(match.date)}</span>
        </div>
        <div className="mt-3 grid grid-cols-[1fr,auto,1fr] items-center gap-2 text-base font-bold text-zinc-100">
          <span className="text-right truncate">{match.home}</span>
          <span className="px-2 text-cyan-900">vs</span>
          <span className="text-left truncate">{match.away}</span>
        </div>
      </header>
      <div className={`grid gap-3 ${match.odds.draw ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <OddBtn label="1" value={match.odds.home} />
        {match.odds.draw && <OddBtn label="X" value={match.odds.draw} />}
        <OddBtn label="2" value={match.odds.away} />
      </div>
    </article>
  );
}

function OddBtn({ label, value }: { label: string; value: number | undefined }) {
  const displayValue = value !== undefined && value !== null ? value : 0;
  const isDisabled = value === undefined || value === null;
  
  return (
    <button 
      disabled={isDisabled}
      className={`w-full rounded-lg border text-zinc-100 text-sm font-semibold py-2.5 transition focus:outline-none focus:ring-2 focus:ring-cyan-500/30 ${
        isDisabled 
          ? 'bg-neutral-800 border-neutral-600 text-neutral-500 cursor-not-allowed' 
          : 'bg-gradient-to-b from-[#0a1724] to-[#0f2236] hover:from-[#0e2234] hover:to-[#14314d] border-cyan-900/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
      }`}
    >
      <span className="mr-1 text-cyan-700">{label}</span>
      <span className="tracking-wide">{isDisabled ? 'N/A' : displayValue.toFixed(2)}</span>
    </button>
  );
}
