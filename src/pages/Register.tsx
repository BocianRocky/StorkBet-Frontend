import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ name, lastName, email, password });
      // Jeśli backend nie zwraca tokenów (204), przeniesiemy użytkownika do logowania
      navigate('/login');
    } catch (err: any) {
      setError(err?.message || 'Błąd rejestracji');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Rejestracja</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="space-y-1">
          <label className="block text-sm">Imię</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Nazwisko</label>
          <input className="w-full border rounded px-3 py-2" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Email</label>
          <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <label className="block text-sm">Hasło</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button disabled={loading} className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50">
          {loading ? 'Rejestrowanie...' : 'Zarejestruj się'}
        </button>
      </form>
    </div>
  );
};

export default Register;


