// Rzeczywista struktura danych z API
export interface ApiEventData {
  eventId: number;
  eventDate: string;
  odds: Array<{
    teamName: string;
    oddsValue: number;
    oddId: number;
  }>;
}

// Przekształcona struktura dla komponentów
export interface OddsData {
  id: string; // eventId as string (numeric)
  home: string;
  away: string;
  league: string;
  date: string;
  odds: {
    home: number | undefined;
    draw?: number | undefined;
    away: number | undefined;
  };
  oddIds: {
    home?: number;
    draw?: number;
    away?: number;
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

import { fetchWithAuth } from './fetchWithAuth';

export interface AdminWinLossRatio {
  totalBets: number;
  wonBets: number;
  lostBets: number;
  winRatePercent: number;
  lossRatePercent: number;
}

export interface AdminBookmakerProfit {
  totalStake: number;
  totalWinnings: number;
  bookmakerProfit: number;
}

export interface AdminSportCouponsItem {
  sportId: number;
  sportName: string;
  betSlipCount: number;
}

export interface AdminSportEffectivenessItem {
  sportId: number;
  sportName: string;
  totalBets: number;
  wonBets: number;
  effectivenessPercent: number;
}

export interface AdminMonthlyCouponsItem {
  monthName: string;
  betsCount: number;
  totalYearCount: number;
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
        const drawOdds = event.odds.find(odd => odd.teamName === 'Draw');
        const nonDraw = event.odds.filter(odd => odd.teamName !== 'Draw');
        const homeOdds = nonDraw[0];
        const awayOdds = nonDraw[1] ?? nonDraw[0];
        
        // Jeśli są więcej niż 2 zespoły (nie licząc Draw), weź pierwsze dwa
        const homeTeam = homeOdds?.teamName || 'Unknown Team';
        const awayTeam = awayOdds?.teamName || 'Unknown Team';
        
        return {
          id: String(event.eventId),
          home: homeTeam,
          away: awayTeam,
          league: `${sportKey.replace('_', ' ').toUpperCase()}`, // Użyj sportKey jako ligi
          date: event.eventDate,
          odds: {
            home: homeOdds?.oddsValue,
            draw: drawOdds?.oddsValue,
            away: nonDraw.length > 1 ? nonDraw[1]?.oddsValue : nonDraw[0]?.oddsValue,
          },
          oddIds: {
            home: homeOdds?.oddId,
            draw: drawOdds?.oddId,
            away: nonDraw.length > 1 ? nonDraw[1]?.oddId : nonDraw[0]?.oddId,
          },
        };
      });
    } catch (error) {
      console.error(`Błąd podczas pobierania odds dla sportu ${sportKey}:`, error);
      throw error;
    }
  }

  async fetchPromotionsToday(): Promise<import('../types/promotion').PromotionToday[]> {
    try {
      const response = await fetch(`${this.baseUrl}/Promotions/today`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Błąd podczas pobierania promocji (today):', error);
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

  async fetchAdminWinLossRatio(): Promise<AdminWinLossRatio> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Admin/win-loss-ratio`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as AdminWinLossRatio;
    } catch (error) {
      console.error('Błąd podczas pobierania statystyk wygranych/przegranych (admin):', error);
      throw error;
    }
  }

  async fetchAdminBookmakerProfit(): Promise<AdminBookmakerProfit> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Admin/bookmaker-profit`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as AdminBookmakerProfit;
    } catch (error) {
      console.error('Błąd podczas pobierania zysku bukmachera (admin):', error);
      throw error;
    }
  }

  async fetchAdminSportCoupons(): Promise<AdminSportCouponsItem[]> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Admin/sport-coupons`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? (data as AdminSportCouponsItem[]) : [];
    } catch (error) {
      console.error('Błąd podczas pobierania kuponów per sport (admin):', error);
      throw error;
    }
  }

  async fetchAdminSportEffectiveness(): Promise<AdminSportEffectivenessItem[]> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Admin/sport-effectiveness`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? (data as AdminSportEffectivenessItem[]) : [];
    } catch (error) {
      console.error('Błąd podczas pobierania skuteczności per sport (admin):', error);
      throw error;
    }
  }

  async fetchAdminMonthlyCoupons(): Promise<AdminMonthlyCouponsItem[]> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Admin/monthly-coupons`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? (data as AdminMonthlyCouponsItem[]) : [];
    } catch (error) {
      console.error('Błąd podczas pobierania kuponów miesięcznych (admin):', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
