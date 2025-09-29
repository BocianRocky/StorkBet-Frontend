import { fetchWithAuth } from './fetchWithAuth';

export interface PlayerMeResponse {
  name: string;
  lastName: string;
  accountBalance: number;
}

const BASE_URL = '/api/Players';

export async function getMe(): Promise<PlayerMeResponse> {
  const res = await fetchWithAuth(`${BASE_URL}/me`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function takeBetslip(amount: number, oddsIds: number[]): Promise<void> {
  const res = await fetchWithAuth(`${BASE_URL}/betslips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, oddsIds }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return;
}

export interface PlayerBetslipSummary {
  id: number;
  amount: number;
  date: string; // ISO string from backend
  wynik: string | null; // result
  totalOdds: number;
  potentialWin: number;
  oddsCount: number;
}

export async function getMyBetslips(): Promise<PlayerBetslipSummary[]> {
  const res = await fetchWithAuth(`${BASE_URL}/betslips`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface PlayerBetslipDetailsOddsItem {
  id: number;
  constOdd: number;
  wynik: string | null;
  event: {
    id: number;
    name: string;
    date: string;
  };
  team: {
    id: number;
    name: string;
  };
}

export interface PlayerBetslipDetails {
  id: number;
  amount: number;
  date: string;
  wynik: string | null;
  totalOdds: number;
  potentialWin: number;
  betSlipOdds: PlayerBetslipDetailsOddsItem[];
}

export async function getBetslipById(id: number): Promise<PlayerBetslipDetails> {
  const res = await fetchWithAuth(`${BASE_URL}/betslips/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}