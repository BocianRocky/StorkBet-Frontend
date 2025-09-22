// Rzeczywista struktura danych z API
export interface ApiEventData {
  eventId: number;
  eventDate: string;
  odds: Array<{
    teamName: string;
    oddsValue: number;
  }>;
}

// Przekształcona struktura dla komponentów
export interface OddsData {
  id: string;
  home: string;
  away: string;
  league: string;
  date: string;
  odds: {
    home: number | undefined;
    draw?: number | undefined;
    away: number | undefined;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface GroupedSportItem {
  title: string;
  group: string;
  key: string;
}

export interface GroupedSports {
  group: string;
  sports: GroupedSportItem[];
}

class ApiService {
  private baseUrl = '/api';

  async fetchOddsForSport(sportKey: string): Promise<OddsData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/Odds/${sportKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiEventData[] = await response.json();
      
      // Przekształcenie danych z API do formatu komponentów
      return data.map((event: ApiEventData) => {
        // Znajdź zespoły i kursy
        const homeOdds = event.odds.find(odd => odd.teamName !== 'Draw');
        const drawOdds = event.odds.find(odd => odd.teamName === 'Draw');
        const awayOdds = event.odds.filter(odd => odd.teamName !== 'Draw');
        
        // Jeśli są więcej niż 2 zespoły (nie licząc Draw), weź pierwsze dwa
        const homeTeam = homeOdds?.teamName || 'Unknown Team';
        const awayTeam = awayOdds.length > 1 ? awayOdds[1]?.teamName : awayOdds[0]?.teamName || 'Unknown Team';
        
        return {
          id: `event-${event.eventId}`,
          home: homeTeam,
          away: awayTeam,
          league: `${sportKey.replace('_', ' ').toUpperCase()}`, // Użyj sportKey jako ligi
          date: event.eventDate,
          odds: {
            home: homeOdds?.oddsValue,
            draw: drawOdds?.oddsValue,
            away: awayOdds.length > 1 ? awayOdds[1]?.oddsValue : awayOdds[0]?.oddsValue,
          }
        };
      });
    } catch (error) {
      console.error(`Błąd podczas pobierania odds dla sportu ${sportKey}:`, error);
      throw error;
    }
  }

  async fetchGroupedSports(): Promise<GroupedSports[]> {
    try {
      const response = await fetch(`${this.baseUrl}/Sports/grouped`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Błąd podczas pobierania sportów (grouped):', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
