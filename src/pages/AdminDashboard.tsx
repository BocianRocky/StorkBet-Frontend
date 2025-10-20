import React from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService, type AdminWinLossRatio, type AdminBookmakerProfit, type AdminSportCouponsItem, type AdminSportEffectivenessItem, type AdminMonthlyCouponsItem, type AdminPlayerProfitItem, type UncompletedEvent, type UpdateEventResultRequest } from '../services/api';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [playersProfit, setPlayersProfit] = React.useState<AdminPlayerProfitItem[] | null>(null);
  const [playersProfitLoading, setPlayersProfitLoading] = React.useState<boolean>(false);
  const [playersProfitError, setPlayersProfitError] = React.useState<string | null>(null);
  const [playersFilter, setPlayersFilter] = React.useState<string>("\n");
  
  // Uncompleted events state
  const [uncompletedEvents, setUncompletedEvents] = React.useState<UncompletedEvent[] | null>(null);
  const [uncompletedEventsLoading, setUncompletedEventsLoading] = React.useState<boolean>(false);
  const [uncompletedEventsError, setUncompletedEventsError] = React.useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<UncompletedEvent | null>(null);
  const [updatingResult, setUpdatingResult] = React.useState<boolean>(false);
  const [resultForm, setResultForm] = React.useState<{
    team1Id: number;
    team2Id: number;
    team1Score: number;
    team2Score: number;
  }>({
    team1Id: 0,
    team2Id: 0,
    team1Score: 0,
    team2Score: 0,
  });
  const [resultTeams, setResultTeams] = React.useState<{
    team1Name: string;
    team2Name: string;
  }>({ team1Name: '', team2Name: '' });

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
    async function loadPlayersProfit() {
      setPlayersProfitLoading(true);
      setPlayersProfitError(null);
      try {
        const res = await apiService.fetchAdminPlayersProfit();
        if (mounted) setPlayersProfit(res);
      } catch (e: any) {
        if (mounted) setPlayersProfitError(e?.message || 'Nie udało się pobrać zysków graczy');
      } finally {
        if (mounted) setPlayersProfitLoading(false);
      }
    }
    loadPlayersProfit();
    async function loadUncompletedEvents() {
      setUncompletedEventsLoading(true);
      setUncompletedEventsError(null);
      try {
        const res = await apiService.fetchUncompletedEvents();
        if (mounted) setUncompletedEvents(res);
      } catch (e: any) {
        if (mounted) setUncompletedEventsError(e?.message || 'Nie udało się pobrać nieukończonych wydarzeń');
      } finally {
        if (mounted) setUncompletedEventsLoading(false);
      }
    }
    loadUncompletedEvents();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSelectEvent = (event: UncompletedEvent) => {
    setSelectedEvent(event);
    // Prefer mapping based on eventName pattern: "Team A vs Team B"
    const nameParts = event.eventName.split(/\s+vs\.?\s+/i);
    const nonDrawOdds = event.odds.filter(odd => odd.teamName !== 'Draw');

    if (nameParts.length === 2) {
      const leftName = nameParts[0].trim();
      const rightName = nameParts[1].trim();
      const leftOdd = nonDrawOdds.find(o => o.teamName === leftName);
      const rightOdd = nonDrawOdds.find(o => o.teamName === rightName);

      if (leftOdd && rightOdd) {
        setResultForm({
          team1Id: leftOdd.teamId,
          team2Id: rightOdd.teamId,
          team1Score: 0,
          team2Score: 0,
        });
        setResultTeams({ team1Name: leftName, team2Name: rightName });
        return;
      }
    }

    // Fallback: take first two non-draw odds as-is
    if (nonDrawOdds.length >= 2) {
      setResultForm({
        team1Id: nonDrawOdds[0].teamId,
        team2Id: nonDrawOdds[1].teamId,
        team1Score: 0,
        team2Score: 0,
      });
      setResultTeams({ team1Name: nonDrawOdds[0].teamName, team2Name: nonDrawOdds[1].teamName });
    }
  };

  const handleUpdateResult = async () => {
    if (!selectedEvent) return;
    
    setUpdatingResult(true);
    try {
      const request: UpdateEventResultRequest = {
        eventId: selectedEvent.eventId,
        team1Id: resultForm.team1Id,
        team2Id: resultForm.team2Id,
        team1Score: resultForm.team1Score,
        team2Score: resultForm.team2Score,
      };
      
      await apiService.updateEventResult(request);
      
      // Refresh uncompleted events
      const updatedEvents = await apiService.fetchUncompletedEvents();
      setUncompletedEvents(updatedEvents);
      setSelectedEvent(null);
      setResultForm({
        team1Id: 0,
        team2Id: 0,
        team1Score: 0,
        team2Score: 0,
      });
      setResultTeams({ team1Name: '', team2Name: '' });
    } catch (error: any) {
      console.error('Błąd podczas aktualizacji wyniku:', error);
      alert('Nie udało się zaktualizować wyniku: ' + (error?.message || 'Nieznany błąd'));
    } finally {
      setUpdatingResult(false);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto w-full mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold">Panel administracyjny</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Wyloguj
        </button>
      </div>
      
      <Tabs defaultValue="statistics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="statistics">Statystyki</TabsTrigger>
          <TabsTrigger value="matches">Mecze bez wyniku</TabsTrigger>
        </TabsList>
        
        <TabsContent value="statistics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Win/Loss Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <p className="text-gray-600">Ładowanie...</p>
            )}
            {error && (
              <p className="text-red-600">{error}</p>
            )}
            {!loading && !error && stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg border border-cyan-900/40 bg-gradient-to-b from-[#0a1724] to-[#0f2236] p-4 text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <p className="text-sm text-cyan-700">Łącznie zakładów</p>
                  <p className="text-2xl font-bold">{stats.totalBets}</p>
                </div>
                <div className="rounded-lg border border-cyan-600 bg-cyan-700/30 p-4 text-cyan-100">
                  <p className="text-sm text-cyan-300">Wygrane</p>
                  <p className="text-2xl font-bold text-cyan-50">{stats.wonBets} <span className="text-base font-medium text-cyan-300">({stats.winRatePercent.toFixed(2)}%)</span></p>
                </div>
                <div className="rounded-lg border border-cyan-900/40 bg-gradient-to-b from-[#0a1724] to-[#0f2236] p-4 text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <p className="text-sm text-cyan-700">Przegrane</p>
                  <p className="text-2xl font-bold">{stats.lostBets} <span className="text-base font-medium text-cyan-700">({stats.lossRatePercent.toFixed(2)}%)</span></p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zysk bukmachera</CardTitle>
          </CardHeader>
          <CardContent>
            {profitLoading && (
              <p className="text-gray-600">Ładowanie...</p>
            )}
            {profitError && (
              <p className="text-red-600">{profitError}</p>
            )}
            {!profitLoading && !profitError && profit && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg border border-cyan-900/40 bg-gradient-to-b from-[#0a1724] to-[#0f2236] p-4 text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <p className="text-sm text-cyan-700">Suma stawek</p>
                  <p className="text-2xl font-bold">{profit.totalStake.toFixed(2)}</p>
                </div>
                <div className="rounded-lg border border-cyan-600 bg-cyan-700/30 p-4 text-cyan-100">
                  <p className="text-sm text-cyan-300">Suma wygranych</p>
                  <p className="text-2xl font-bold text-cyan-50">{profit.totalWinnings.toFixed(2)}</p>
                </div>
                <div className="rounded-lg border border-cyan-900/40 bg-gradient-to-b from-[#0a1724] to-[#0f2236] p-4 text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <p className="text-sm text-cyan-700">Zysk bukmachera</p>
                  <p className="text-2xl font-bold">{profit.bookmakerProfit.toFixed(2)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Kupony per sport</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skuteczność per sport</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Kupony miesięcznie (bieżący rok)</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Zysk graczy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-sm text-gray-600 mb-1">Filtr (imię lub nazwisko)</label>
                <input
                  type="text"
                  value={playersFilter}
                  onChange={(e) => setPlayersFilter(e.target.value)}
                  placeholder="np. Jan lub Kowalski"
                  className="w-full rounded-md border border-cyan-900/40 bg-[#0a1724] text-zinc-100 placeholder:text-cyan-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                />
              </div>
            </div>

            {playersProfitLoading && <p className="text-gray-600">Ładowanie...</p>}
            {playersProfitError && <p className="text-red-600">{playersProfitError}</p>}
            {!playersProfitLoading && !playersProfitError && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2 pr-4">ID</th>
                      <th className="py-2 pr-4">Imię</th>
                      <th className="py-2 pr-4">Nazwisko</th>
                      <th className="py-2 pr-4">Saldo</th>
                      <th className="py-2 pr-4">Zysk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(playersProfit || [])
                      .filter(p => {
                        const q = playersFilter.trim().toLowerCase();
                        if (!q) return true;
                        return p.name.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q);
                      })
                      .map((p) => (
                        <tr key={p.playerId} className="border-t border-cyan-900/20">
                          <td className="py-2 pr-4 text-gray-800">{p.playerId}</td>
                          <td className="py-2 pr-4 text-gray-800">{p.name}</td>
                          <td className="py-2 pr-4 text-gray-800">{p.lastName}</td>
                          <td className="py-2 pr-4 text-gray-800">{p.accountBalance.toFixed(2)}</td>
                          <td className={`py-2 pr-4 font-medium ${p.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{p.profit.toFixed(2)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informacje o administratorze</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Imię i nazwisko</div>
                <div className="font-medium">{user?.name} {user?.lastName}</div>
              </div>
              <div>
                <div className="text-gray-500">Email</div>
                <div className="font-medium break-all">{user?.email}</div>
              </div>
              <div>
                <div className="text-gray-500">ID użytkownika</div>
                <div className="font-medium">{user?.userId}</div>
          </div>
        </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>
        
        <TabsContent value="matches" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Uncompleted Events List */}
            <Card>
              <CardHeader>
                <CardTitle>Mecze bez wyniku</CardTitle>
              </CardHeader>
              <CardContent>
                {uncompletedEventsLoading && (
                  <p className="text-gray-600">Ładowanie...</p>
                )}
                {uncompletedEventsError && (
                  <p className="text-red-600">{uncompletedEventsError}</p>
                )}
                {!uncompletedEventsLoading && !uncompletedEventsError && uncompletedEvents && uncompletedEvents.length > 0 && (
                  <div className="space-y-3">
                    {uncompletedEvents.map((event) => (
                      <div
                        key={event.eventId}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedEvent?.eventId === event.eventId
                            ? 'border-cyan-500 bg-cyan-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleSelectEvent(event)}
                      >
                        <div className="font-medium">{event.eventName}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(event.eventDate).toLocaleString('pl-PL')}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Kursy: {event.odds.map(odd => `${odd.teamName}: ${odd.oddsValue}`).join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!uncompletedEventsLoading && !uncompletedEventsError && uncompletedEvents && uncompletedEvents.length === 0 && (
                  <p className="text-gray-600">Brak meczów bez wyniku.</p>
                )}
              </CardContent>
            </Card>

            {/* Result Update Form */}
            <Card>
              <CardHeader>
                <CardTitle>Wprowadź wynik</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedEvent ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Wybrany mecz:</Label>
                      <p className="text-sm text-gray-600">{selectedEvent.eventName}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="team1Score">Wynik: {resultTeams.team1Name || 'Zespół 1'}</Label>
                        <Input
                          id="team1Score"
                          type="number"
                          min="0"
                          value={resultForm.team1Score}
                          onChange={(e) => setResultForm(prev => ({
                            ...prev,
                            team1Score: parseInt(e.target.value) || 0
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="team2Score">Wynik: {resultTeams.team2Name || 'Zespół 2'}</Label>
                        <Input
                          id="team2Score"
                          type="number"
                          min="0"
                          value={resultForm.team2Score}
                          onChange={(e) => setResultForm(prev => ({
                            ...prev,
                            team2Score: parseInt(e.target.value) || 0
                          }))}
                        />
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleUpdateResult}
                      disabled={updatingResult}
                      className="w-full"
                    >
                      {updatingResult ? 'Aktualizowanie...' : 'Zaktualizuj wynik'}
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-600">Wybierz mecz z listy po lewej stronie, aby wprowadzić wynik.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
