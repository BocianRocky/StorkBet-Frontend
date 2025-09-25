import { refresh as refreshRequest } from './auth';

export interface StoredAuth {
  accessToken: string | null;
  refreshToken: string | null;
  refreshTokenExp: string | null;
}

const AUTH_STORAGE_KEY = 'auth';

function readAuth(): StoredAuth {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { accessToken: null, refreshToken: null, refreshTokenExp: null };
    const parsed = JSON.parse(raw);
    return {
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
      refreshTokenExp: parsed.refreshTokenExp ?? null,
    };
  } catch {
    return { accessToken: null, refreshToken: null, refreshTokenExp: null };
  }
}

function writeAuth(next: StoredAuth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
}

function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function isRefreshExpired(exp: string | null): boolean {
  if (!exp) return true;
  const expMs = Date.parse(exp);
  if (Number.isNaN(expMs)) return true;
  const now = Date.now();
  // refresh considered expired if within 5 seconds of expiration to avoid race
  return now >= expMs - 5000;
}

async function tryRefreshTokens(): Promise<string | null> {
  const { refreshToken, refreshTokenExp } = readAuth();
  if (!refreshToken || isRefreshExpired(refreshTokenExp)) {
    clearAuth();
    return null;
  }
  try {
    const refreshed = await refreshRequest(refreshToken);
    const merged = {
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
      refreshTokenExp: refreshed.refreshTokenExp,
    } as StoredAuth;
    writeAuth(merged);
    return refreshed.accessToken;
  } catch {
    clearAuth();
    return null;
  }
}

export async function fetchWithAuth(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const auth = readAuth();
  const headers = new Headers(init.headers || {});
  if (auth.accessToken) {
    headers.set('Authorization', `Bearer ${auth.accessToken}`);
  }

  let response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    const newAccess = await tryRefreshTokens();
    if (!newAccess) {
      return response; // still 401, caller can handle logout/redirect
    }
    const retryHeaders = new Headers(init.headers || {});
    retryHeaders.set('Authorization', `Bearer ${newAccess}`);
    response = await fetch(input, { ...init, headers: retryHeaders });
  }

  return response;
}

export function persistAuth(auth: StoredAuth) {
  writeAuth(auth);
}

export function clearPersistedAuth() {
  clearAuth();
}

export function getPersistedAuth(): StoredAuth {
  return readAuth();
}


