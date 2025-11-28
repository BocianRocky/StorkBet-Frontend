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

export interface PopularEvent {
  eventId: number;
  eventName: string;
  eventDate: string;
  sportId: number;
  sportKey: string;
  sportTitle: string;
  sportGroup: string;
  odds: Array<{
    oddId: number;
    teamName: string;
    oddsValue: number;
  }>;
  betCount: number;
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

export interface SportSimpleDto {
  id: number;
  title: string;
  key: string;
}

import { fetchWithAuth } from './fetchWithAuth';
export interface ApiMessage { message: string }

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

export interface AdminPlayerProfitItem {
  playerId: number;
  name: string;
  lastName: string;
  accountBalance: number;
  profit: number;
}

export interface UncompletedEvent {
  eventId: number;
  eventName: string;
  eventDate: string;
  odds: Array<{
    teamId: number;
    teamName: string;
    oddsValue: number;
  }>;
}

export interface UpdateEventResultRequest {
  eventId: number;
  team1Id: number;
  team2Id: number;
  team1Score: number;
  team2Score: number;
}

export interface PlayerDetails {
  playerId: number;
  name: string;
  lastName: string;
  email: string;
  accountBalance: number;
  betsCount: number;
  wonBets: number;
  lostBets: number;
  effectivenessPercent: number;
  totalStake: number;
  totalWinnings: number;
  profit: number;
  lastBetDate: string;
  transactionsCount: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

export interface UpdatePlayerRequest {
  playerId: number;
  name: string;
  lastName: string;
  email: string;
  accountBalance: number;
  role: number;
}

export interface GroupMember {
  playerId: number;
  name: string;
  lastName: string;
  isOwner: boolean;
}

export interface TyperGroup {
  id: number;
  groupName: string;
  members: GroupMember[];
  messageCount: number;
}

export interface CreateGroupRequest {
  groupName: string;
}

export interface GroupMessage {
  id: number;
  groupId: number;
  playerId: number;
  playerName: string;
  playerLastName: string;
  messageText: string;
}

export interface SendMessageRequest {
  messageText: string;
}

export interface AddMemberRequest {
  playerId: number;
}

class ApiService {
  private baseUrl = '/api';

  async fetchOddsForSport(sportKey: string): Promise<OddsData[]> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Odds/${encodeURIComponent(sportKey)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
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
          league: `${sportKey.replace('_', ' ').toUpperCase()}`,
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

  async importOddsForSport(sportKey: string): Promise<string> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Odds/${encodeURIComponent(sportKey)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiMessage = await response.json();
      return data?.message || 'Operacja zakończona.';
    } catch (error) {
      console.error(`Błąd podczas importu kursów dla sportu ${sportKey}:`, error);
      throw error;
    }
  }

  async syncScoresForSport(sportKey: string, daysFrom: number = 3): Promise<string> {
    try {
      const url = `${this.baseUrl}/Odds/sync-scores/${encodeURIComponent(sportKey)}?daysFrom=${daysFrom}`;

      const response = await fetchWithAuth(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiMessage = await response.json();
      return data?.message || 'Synchronizacja wyników zakończona.';
    } catch (error) {
      console.error(`Błąd podczas synchronizacji wyników dla sportu ${sportKey}:`, error);
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

  async fetchPopularEvents(limit: number = 21, daysAhead?: number): Promise<PopularEvent[]> {
    try {
      let url = `${this.baseUrl}/Home/popular-events?limit=${limit}`;
      if (daysAhead !== undefined) {
        url += `&daysAhead=${daysAhead}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? (data as PopularEvent[]) : [];
    } catch (error) {
      console.error('Błąd podczas pobierania popularnych wydarzeń:', error);
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

  async fetchSportsSimple(): Promise<SportSimpleDto[]> {
    try {
      const response = await fetch(`${this.baseUrl}/Sports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? (data as SportSimpleDto[]) : [];
    } catch (error) {
      console.error('Błąd podczas pobierania listy sportów:', error);
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

  async fetchAdminPlayersProfit(): Promise<AdminPlayerProfitItem[]> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Admin/players-profit`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? (data as AdminPlayerProfitItem[]) : [];
    } catch (error) {
      console.error('Błąd podczas pobierania zysku graczy (admin):', error);
      throw error;
    }
  }

  async fetchUncompletedEvents(): Promise<UncompletedEvent[]> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Admin/events/uncompleted`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? (data as UncompletedEvent[]) : [];
    } catch (error) {
      console.error('Błąd podczas pobierania nieukończonych wydarzeń:', error);
      throw error;
    }
  }

  async updateEventResult(request: UpdateEventResultRequest): Promise<void> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Admin/update-event-result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji wyniku wydarzenia:', error);
      throw error;
    }
  }

  async fetchPlayerDetails(playerId: number): Promise<PlayerDetails> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Admin/players-profit/${playerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as PlayerDetails;
    } catch (error) {
      console.error('Błąd podczas pobierania szczegółów gracza:', error);
      throw error;
    }
  }

  async updatePlayer(request: UpdatePlayerRequest): Promise<void> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Admin/players/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Błąd podczas aktualizacji gracza (admin):', error);
      throw error;
    }
  }

  async deletePlayer(playerId: number): Promise<void> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Admin/${playerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Błąd podczas usuwania gracza (admin):', error);
      throw error;
    }
  }

  async createPromotion(formData: FormData): Promise<void> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Promotions/with-image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Błąd podczas tworzenia promocji:', error);
      throw error;
    }
  }

  async fetchMyGroups(): Promise<TyperGroup[]> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Groups/my-groups`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? (data as TyperGroup[]) : [];
    } catch (error) {
      console.error('Błąd podczas pobierania grup typerów:', error);
      throw error;
    }
  }

  async createGroup(request: CreateGroupRequest): Promise<TyperGroup> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as TyperGroup;
    } catch (error) {
      console.error('Błąd podczas tworzenia grupy typerów:', error);
      throw error;
    }
  }

  async fetchGroupMessages(groupId: number): Promise<GroupMessage[]> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Groups/${groupId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? (data as GroupMessage[]) : [];
    } catch (error) {
      console.error('Błąd podczas pobierania wiadomości grupy:', error);
      throw error;
    }
  }

  async sendGroupMessage(groupId: number, request: SendMessageRequest): Promise<GroupMessage> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Groups/${groupId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as GroupMessage;
    } catch (error) {
      console.error('Błąd podczas wysyłania wiadomości:', error);
      throw error;
    }
  }

  async addMemberToGroup(groupId: number, request: AddMemberRequest): Promise<void> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Groups/${groupId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Błąd podczas dodawania członka do grupy:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
