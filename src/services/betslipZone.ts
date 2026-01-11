import { fetchWithAuth } from './fetchWithAuth';

export interface BetSlipZoneItemDto {
  postId: number;
  betSlipId: number;
  playerName: string;
  playerLastName: string;
  createdAt: string;
  isActive: boolean;
  amount: number;
  totalOdds: number;
  potentialWin: number;
  oddsCount: number;
  wynik: number | string | boolean | null;
  fireCount: number;
  coldCount: number;
  safeCount: number;
  crazyCount: number;
  userReaction: number | null;
}

export interface BetSlipZoneDetailsBetSlipOddDto {
  id: number;
  constOdd: number;
  wynik: number | string | boolean | null;
  event: {
    id: number;
    name: string;
    date: string;
    group: string;
    title: string;
  };
  team: {
    id: number;
    name: string;
  };
}

export interface BetSlipZoneDetailsBetSlipDto {
  id: number;
  amount: number;
  date: string;
  wynik: number | string | boolean | null;
  totalOdds: number;
  potentialWin: number;
  betSlipOdds: BetSlipZoneDetailsBetSlipOddDto[];
}

export interface BetSlipZoneDetailsDto {
  postId: number;
  betSlipId: number;
  playerName: string;
  playerLastName: string;
  createdAt: string;
  isActive: boolean;
  betSlip: BetSlipZoneDetailsBetSlipDto;
  fireCount: number;
  coldCount: number;
  safeCount: number;
  crazyCount: number;
  userReaction: number | null;
}

export interface BetSlipZoneReactionSummaryDto {
  fireCount: number;
  coldCount: number;
  safeCount: number;
  crazyCount: number;
  userReaction: number | null;
}

export type BetSlipZoneSortBy = 'reactions' | 'time';

const BASE_URL = '/api/betslip-zone';

export async function fetchBetSlipZoneFeed(
  page: number = 1,
  pageSize: number = 20,
  sortBy: BetSlipZoneSortBy = 'reactions',
): Promise<BetSlipZoneItemDto[]> {
  const url = `${BASE_URL}?page=${page}&pageSize=${pageSize}&sortBy=${encodeURIComponent(
    sortBy,
  )}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function fetchBetSlipZonePost(
  postId: number,
): Promise<BetSlipZoneDetailsDto> {
  const res = await fetch(`${BASE_URL}/${postId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function createBetSlipZonePost(betSlipId: number): Promise<BetSlipZoneDetailsDto> {
  const res = await fetchWithAuth(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ betSlipId }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function sendBetSlipZoneReaction(
  postId: number,
  reactionType: 1 | 2 | 3 | 4,
): Promise<BetSlipZoneReactionSummaryDto> {
  const res = await fetchWithAuth(`${BASE_URL}/${postId}/reactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reactionType }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function fetchMyBetSlipZonePosts(
  page: number = 1,
  pageSize: number = 20,
): Promise<BetSlipZoneItemDto[]> {
  const url = `${BASE_URL}/my-posts?page=${page}&pageSize=${pageSize}`;

  const res = await fetchWithAuth(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}












