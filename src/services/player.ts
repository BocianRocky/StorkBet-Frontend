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

export interface PlayerProfileResponse {
  name: string;
  lastName: string;
  email: string;
  accountBalance: number;
}

export async function getProfile(): Promise<PlayerProfileResponse> {
  const res = await fetchWithAuth(`${BASE_URL}/profile`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function takeBetslip(amount: number, oddsIds: number[], availablePromotionId?: number | null): Promise<void> {
  const payload: {
    amount: number;
    oddsIds: number[];
    availablePromotionId?: number;
  } = {
    amount,
    oddsIds,
  };

  if (availablePromotionId && Number.isFinite(availablePromotionId) && availablePromotionId > 0) {
    payload.availablePromotionId = availablePromotionId;
  }

  const res = await fetchWithAuth(`${BASE_URL}/betslips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
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
  wynik: number | string | boolean | null; // result can be numeric/string/boolean/null
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
  wynik: number | string | boolean | null;
  event: {
    id: number;
    name: string;
    date: string;
    group?: string;
    title?: string;
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
  wynik: number | string | boolean | null;
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

export interface DepositRequest {
  amount: number;
  paymentMethod: number; // 1 for deposit
}

export interface WithdrawalRequest {
  amount: number;
  paymentMethod: number; // 2 for withdrawal
}

export async function deposit(amount: number, paymentMethod: number = 1): Promise<void> {
  const res = await fetchWithAuth(`${BASE_URL}/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, paymentMethod }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return;
}

export async function withdrawal(amount: number, paymentMethod: number = 2): Promise<void> {
  const res = await fetchWithAuth(`${BASE_URL}/withdrawal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, paymentMethod }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return;
}