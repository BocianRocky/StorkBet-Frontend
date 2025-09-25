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
