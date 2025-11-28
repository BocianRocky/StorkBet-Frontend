import { useSportContext } from "@/context/SportContext";
import { OddsData, apiService, PopularEvent } from "@/services/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import SimpleMatchCard from "@/components/match/SimpleMatchCard";
import PromotionsSlider from "./PromotionsSlider";
import { useEffect, useState } from "react";

// Funkcja do przekształcenia PopularEvent na OddsData
const transformPopularEventToOddsData = (event: PopularEvent): OddsData => {
  // Rozdzielenie eventName na home i away (format: "Team1 vs Team2")
  const parts = event.eventName.split(" vs ");
  const home = parts[0]?.trim() || "Unknown";
  const away = parts[1]?.trim() || "Unknown";

  // Znajdź kursy - dopasuj na podstawie nazwy drużyny
  const drawOdd = event.odds.find(odd => odd.teamName === "Draw");
  const homeOdd = event.odds.find(odd => odd.teamName === home);
  const awayOdd = event.odds.find(odd => odd.teamName === away);
  
  // Jeśli nie znaleziono dokładnego dopasowania, użyj pierwszej i drugiej nie-Draw
  const nonDrawOdds = event.odds.filter(odd => odd.teamName !== "Draw");
  const fallbackHomeOdd = homeOdd || nonDrawOdds[0];
  const fallbackAwayOdd = awayOdd || nonDrawOdds[1] || nonDrawOdds[0];

  // Format ligi: sportTitle (sportGroup) - np. "EPL (Soccer)" lub "Boxing"
  const league = event.sportGroup === event.sportTitle 
    ? event.sportTitle 
    : `${event.sportTitle} (${event.sportGroup})`;

  return {
    id: String(event.eventId),
    home: home,
    away: away,
    league: league,
    date: event.eventDate,
    odds: {
      home: fallbackHomeOdd?.oddsValue,
      draw: drawOdd?.oddsValue,
      away: fallbackAwayOdd?.oddsValue,
    },
    oddIds: {
      home: fallbackHomeOdd?.oddId,
      draw: drawOdd?.oddId,
      away: fallbackAwayOdd?.oddId,
    },
  };
};

export default function MainContent() {
  const { selectedSport, selectedSportTitle, oddsData, isLoading, error } = useSportContext();
  const [popularMatches, setPopularMatches] = useState<OddsData[]>([]);
  const [popularMatchesLoading, setPopularMatchesLoading] = useState<boolean>(false);
  const [popularMatchesError, setPopularMatchesError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedSport) {
      // Pobierz popularne mecze tylko gdy nie wybrano sportu (strona główna)
      let mounted = true;
      setPopularMatchesLoading(true);
      setPopularMatchesError(null);
      
      apiService
        .fetchPopularEvents(21)
        .then((events) => {
          if (mounted) {
            const transformed = events.map(transformPopularEventToOddsData);
            setPopularMatches(transformed);
            setPopularMatchesError(null);
          }
        })
        .catch((e: unknown) => {
          if (mounted) {
            setPopularMatchesError(e instanceof Error ? e.message : "Nieznany błąd");
            setPopularMatches([]);
          }
        })
        .finally(() => {
          if (mounted) {
            setPopularMatchesLoading(false);
          }
        });

      return () => {
        mounted = false;
      };
    }
  }, [selectedSport]);

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
        
        {popularMatchesLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-neutral-300 text-lg">Ładowanie popularnych meczów...</p>
            </div>
          </div>
        ) : popularMatchesError ? (
          <div className="flex items-center justify-center py-10">
            <div className="text-center">
              <div className="text-red-400 text-xl mb-2">⚠️</div>
              <p className="text-red-400 text-lg font-semibold">Błąd podczas pobierania meczów</p>
              <p className="text-neutral-400 mt-2">{popularMatchesError}</p>
            </div>
          </div>
        ) : popularMatches.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <div className="text-center">
              <p className="text-neutral-400">Brak dostępnych meczów</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {popularMatches.map((match) => (
              <SimpleMatchCard key={match.id} match={match} compact={true} />
            ))}
          </div>
        )}
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
