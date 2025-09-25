export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExp: string;
  userId: number;
  name: string;
  lastName: string;
  email: string;
  accountBalance: number;
}

const BASE_URL = '/api/auth';

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Backend wymaga pola Username – mapujemy z email
    body: JSON.stringify({ username: data.email, password: data.password })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

function parseJsonSafe<T>(res: Response): Promise<T | null> {
  return res
    .text()
    .then((text) => {
      if (!text) return null;
      return JSON.parse(text) as T;
    });
}

export async function register(data: RegisterRequest): Promise<AuthResponse | null> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Jeżeli backend wymaga Username, wyślijmy je jako email (lub można dodać osobne pole w UI)
    body: JSON.stringify({ ...data, username: data.email })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  // Backend może zwrócić 204/empty body – obsłuż to i zwróć null
  const parsed = await parseJsonSafe<AuthResponse>(res);
  return parsed;
}

export async function refresh(refreshToken: string): Promise<Pick<AuthResponse, 'accessToken' | 'refreshToken' | 'refreshTokenExp'>> {
  const res = await fetch(`${BASE_URL}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}


