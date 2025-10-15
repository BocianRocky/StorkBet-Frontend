import React from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService, type AdminWinLossRatio, type AdminBookmakerProfit, type AdminSportCouponsItem, type AdminSportEffectivenessItem, type AdminMonthlyCouponsItem } from '../services/api';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = React.useState<AdminWinLossRatio | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [profit, setProfit] = React.useState<AdminBookmakerProfit | null>(null);
  const [profitLoading, setProfitLoading] = React.useState<boolean>(false);
  const [profitError, setProfitError] = React.useState<string | null>(null);
  const [sportCoupons, setSportCoupons] = React.useState<AdminSportCouponsItem[] | null>(null);
  const [sportCouponsLoading, setSportCouponsLoading] = React.useState<boolean>(false);
  const [sportCouponsError, setSportCouponsError] = React.useState<string | null>(null);
  const [sportEffectiveness, setSportEffectiveness] = React.useState<AdminSportEffectivenessItem[] | null>(null);
  const [sportEffectivenessLoading, setSportEffectivenessLoading] = React.useState<boolean>(false);
  const [sportEffectivenessError, setSportEffectivenessError] = React.useState<string | null>(null);
  const [monthlyCoupons, setMonthlyCoupons] = React.useState<AdminMonthlyCouponsItem[] | null>(null);
  const [monthlyCouponsLoading, setMonthlyCouponsLoading] = React.useState<boolean>(false);
  const [monthlyCouponsError, setMonthlyCouponsError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.fetchAdminWinLossRatio();
        if (mounted) setStats(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Nie udało się pobrać statystyk');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    async function loadProfit() {
      setProfitLoading(true);
      setProfitError(null);
      try {
        const res = await apiService.fetchAdminBookmakerProfit();
        if (mounted) setProfit(res);
      } catch (e: any) {
        if (mounted) setProfitError(e?.message || 'Nie udało się pobrać zysku bukmachera');
      } finally {
        if (mounted) setProfitLoading(false);
      }
    }
    loadProfit();
    async function loadSportCoupons() {
      setSportCouponsLoading(true);
      setSportCouponsError(null);
      try {
        const res = await apiService.fetchAdminSportCoupons();
        if (mounted) setSportCoupons(res);
      } catch (e: any) {
        if (mounted) setSportCouponsError(e?.message || 'Nie udało się pobrać kuponów per sport');
      } finally {
        if (mounted) setSportCouponsLoading(false);
      }
    }
    loadSportCoupons();
    async function loadSportEffectiveness() {
      setSportEffectivenessLoading(true);
      setSportEffectivenessError(null);
      try {
        const res = await apiService.fetchAdminSportEffectiveness();
        if (mounted) setSportEffectiveness(res);
      } catch (e: any) {
        if (mounted) setSportEffectivenessError(e?.message || 'Nie udało się pobrać skuteczności per sport');
      } finally {
        if (mounted) setSportEffectivenessLoading(false);
      }
    }
    loadSportEffectiveness();
    async function loadMonthlyCoupons() {
      setMonthlyCouponsLoading(true);
      setMonthlyCouponsError(null);
      try {
        const res = await apiService.fetchAdminMonthlyCoupons();
        if (mounted) setMonthlyCoupons(res);
      } catch (e: any) {
        if (mounted) setMonthlyCouponsError(e?.message || 'Nie udało się pobrać miesięcznych kuponów');
      } finally {
        if (mounted) setMonthlyCouponsLoading(false);
      }
    }
    loadMonthlyCoupons();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Wyloguj
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Użytkownicy</h3>
              <p className="text-blue-700">Zarządzaj użytkownikami systemu</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Zakłady</h3>
              <p className="text-green-700">Przeglądaj i zarządzaj zakładami</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Promocje</h3>
              <p className="text-purple-700">Dodawaj i edytuj promocje</p>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Raporty</h3>
              <p className="text-yellow-700">Generuj raporty finansowe</p>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Ustawienia</h3>
              <p className="text-red-700">Konfiguracja systemu</p>
            </div>
            
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Wsparcie</h3>
              <p className="text-indigo-700">Zarządzaj zgłoszeniami</p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-white border rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Win/Loss Ratio</h3>
            {loading && (
              <p className="text-gray-600">Ładowanie...</p>
            )}
            {error && (
              <p className="text-red-600">{error}</p>
            )}
            {!loading && !error && stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Łącznie zakładów</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBets}</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-sm text-green-700">Wygrane</p>
                  <p className="text-2xl font-bold text-green-900">{stats.wonBets} <span className="text-base font-medium">({stats.winRatePercent.toFixed(2)}%)</span></p>
                </div>
                <div className="bg-red-50 p-4 rounded">
                  <p className="text-sm text-red-700">Przegrane</p>
                  <p className="text-2xl font-bold text-red-900">{stats.lostBets} <span className="text-base font-medium">({stats.lossRatePercent.toFixed(2)}%)</span></p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-white border rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Zysk bukmachera</h3>
            {profitLoading && (
              <p className="text-gray-600">Ładowanie...</p>
            )}
            {profitError && (
              <p className="text-red-600">{profitError}</p>
            )}
            {!profitLoading && !profitError && profit && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Suma stawek</p>
                  <p className="text-2xl font-bold text-gray-900">{profit.totalStake.toFixed(2)}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-blue-700">Suma wygranych</p>
                  <p className="text-2xl font-bold text-blue-900">{profit.totalWinnings.toFixed(2)}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded">
                  <p className="text-sm text-amber-700">Zysk bukmachera</p>
                  <p className="text-2xl font-bold text-amber-900">{profit.bookmakerProfit.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-white border rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Kupony per sport</h3>
            {sportCouponsLoading && (
              <p className="text-gray-600">Ładowanie...</p>
            )}
            {sportCouponsError && (
              <p className="text-red-600">{sportCouponsError}</p>
            )}
            {!sportCouponsLoading && !sportCouponsError && sportCoupons && sportCoupons.length > 0 && (
              <ChartContainer
                config={Object.fromEntries(
                  sportCoupons.map((s) => [s.sportName, { label: s.sportName }])
                )}
                className="h-80"
              >
                <BarChart data={sportCoupons}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="sportName"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                  <Bar dataKey="betSlipCount" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
            {!sportCouponsLoading && !sportCouponsError && sportCoupons && sportCoupons.length === 0 && (
              <p className="text-gray-600">Brak danych.</p>
            )}
          </div>

          <div className="mt-8 p-6 bg-white border rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Skuteczność per sport</h3>
            {sportEffectivenessLoading && (
              <p className="text-gray-600">Ładowanie...</p>
            )}
            {sportEffectivenessError && (
              <p className="text-red-600">{sportEffectivenessError}</p>
            )}
            {!sportEffectivenessLoading && !sportEffectivenessError && sportEffectiveness && sportEffectiveness.length > 0 && (
              <ChartContainer
                config={Object.fromEntries(
                  sportEffectiveness.map((s) => [s.sportName, { label: s.sportName }])
                )}
                className="h-80"
              >
                <BarChart data={sportEffectiveness}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="sportName"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    content={<ChartTooltipContent />}
                  />
                  <Bar dataKey="effectivenessPercent" fill="hsl(var(--secondary))" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
            {!sportEffectivenessLoading && !sportEffectivenessError && sportEffectiveness && sportEffectiveness.length === 0 && (
              <p className="text-gray-600">Brak danych.</p>
            )}
          </div>

          <div className="mt-8 p-6 bg-white border rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Kupony miesięcznie (bieżący rok)</h3>
            {monthlyCouponsLoading && (
              <p className="text-gray-600">Ładowanie...</p>
            )}
            {monthlyCouponsError && (
              <p className="text-red-600">{monthlyCouponsError}</p>
            )}
            {!monthlyCouponsLoading && !monthlyCouponsError && monthlyCoupons && monthlyCoupons.length > 0 && (
              <ChartContainer
                config={Object.fromEntries(
                  monthlyCoupons.map((m) => [m.monthName, { label: m.monthName }])
                )}
                className="h-80"
              >
                <BarChart data={monthlyCoupons}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="monthName"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    height={40}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                  <Bar dataKey="betsCount" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ChartContainer>
            )}
            {!monthlyCouponsLoading && !monthlyCouponsError && monthlyCoupons && monthlyCoupons.length === 0 && (
              <p className="text-gray-600">Brak danych.</p>
            )}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informacje o administratorze</h3>
            <p className="text-gray-700">
              Zalogowany jako: <span className="font-semibold">{user?.name} {user?.lastName}</span>
            </p>
            <p className="text-gray-700">
              Email: <span className="font-semibold">{user?.email}</span>
            </p>
            <p className="text-gray-700">
              ID użytkownika: <span className="font-semibold">{user?.userId}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
