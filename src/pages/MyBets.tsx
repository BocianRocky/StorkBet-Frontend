import React, { useEffect, useMemo, useState } from 'react';
import { getMyBetslips, type PlayerBetslipSummary } from '../services/player';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

const MyBets: React.FC = () => {
  const [bets, setBets] = useState<PlayerBetslipSummary[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getMyBetslips()
      .then((data) => {
        if (!mounted) return;
        setBets(data);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Wystąpił błąd podczas pobierania');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const totalStake = useMemo(() => (bets ? bets.reduce((sum, b) => sum + b.amount, 0) : 0), [bets]);
  const totalPotentialWin = useMemo(() => (bets ? bets.reduce((sum, b) => sum + b.potentialWin, 0) : 0), [bets]);

  if (loading) {
    return <div className="p-4">Ładowanie…</div>;
  }
  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }
  if (!bets || bets.length === 0) {
    return <div className="p-4">Brak kuponów.</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto w-full mt-6">
      <h1 className="text-4xl font-semibold mb-8">Moje kupony</h1>

      <div className="space-y-3">
        {bets.map((bet) => {
          const date = new Date(bet.date);
          const formatted = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
          return (
            <Card key={bet.id} className='cursor-pointer '>
              <CardHeader>
                <CardTitle className="flex items-center justify-between w-full">
                  <span>Kupon #{bet.id}</span>
                  <span className="text-sm font-normal text-gray-600">{formatted}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-center text-sm">
                  <div className="col-span-1 md:col-span-1">
                    <div className="text-gray-500">Stawka</div>
                    <div className="font-medium">{bet.amount.toFixed(2)} zł</div>
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <div className="text-gray-500">Kurs łączny</div>
                    <div className="font-medium">{bet.totalOdds}</div>
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <div className="text-gray-500">Potencjalna wygrana</div>
                    <div className="font-medium">{bet.potentialWin.toFixed(2)} zł</div>
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <div className="text-gray-500">Liczba zdarzeń</div>
                    <div className="font-medium">{bet.oddsCount}</div>
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <div className="text-gray-500">Wynik</div>
                    <div className="font-medium">{bet.wynik ?? 'w trakcie'}</div>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="text-xs text-gray-500">Data utworzenia: {formatted}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MyBets;
