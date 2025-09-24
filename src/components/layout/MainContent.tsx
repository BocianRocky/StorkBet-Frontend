import { useSportContext } from "@/context/SportContext";
import { OddsData } from "@/services/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import SimpleMatchCard from "@/components/match/SimpleMatchCard";
import PromotionsSlider from "./PromotionsSlider";

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
    // Strona główna
    return (
      <ScrollArea className="h-full w-full">

        <PromotionsSlider/>
        <div className="mb-6 mt-12">
            <h1 className="text-2xl font-bold text-neutral-100 mb-2">Najpopularniejsze mecze</h1>
            <p className="text-neutral-400">Wybierz sport z menu bocznego, aby zobaczyć więcej opcji</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl-grid-cols-3 gap-6 md:[&>*:nth-child(3n)]:xl:col-span-1">
            {sampleMatches.map((match) => (
              <SimpleMatchCard key={match.id} match={match} />
            ))}
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
