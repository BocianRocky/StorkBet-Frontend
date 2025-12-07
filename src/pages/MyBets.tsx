import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBetslips, type PlayerBetslipSummary } from '../services/player';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';

const MyBets: React.FC = () => {
  const navigate = useNavigate();
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


  if (loading) {
    return <div className="p-4">Ładowanie…</div>;
  }
  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }
  if (!bets || bets.length === 0) {
    return <div className="p-4">Brak kuponów.</div>;
  }

  const mapWynikLabel = (value: unknown): { text: string; className: string } => {
    if (value === null || value === undefined) return { text: 'w trakcie', className: 'text-gray-600' };
    if (typeof value === 'boolean') {
      return value
        ? { text: 'Wygrana', className: 'text-green-600 font-semibold' }
        : { text: 'Przegrana', className: 'text-red-600 font-semibold' };
    }
    if (typeof value === 'number') {
      if (value === 1) return { text: 'Wygrana', className: 'text-green-600 font-semibold' };
      if (value === 0) return { text: 'Przegrana', className: 'text-red-600 font-semibold' };
      return { text: String(value), className: 'text-gray-800' };
    }
    const normalized = String(value).trim().toLowerCase();
    if (normalized === '1' || normalized === 'win' || normalized === 'wygrana' || normalized === 'true') {
      return { text: 'Wygrana', className: 'text-green-600 font-semibold' };
    }
    if (normalized === '0' || normalized === 'loss' || normalized === 'przegrana' || normalized === 'false') {
      return { text: 'Przegrana', className: 'text-red-600 font-semibold' };
    }
    return { text: String(value), className: 'text-gray-800' };
  };

  return (
    <div className="p-4 max-w-4xl mx-auto w-full mt-6">
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => navigate('/profile')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Powrót do mojego profilu
        </Button>
      </div>
      <h1 className="text-4xl font-semibold mb-8">Moje kupony</h1>

      <div className="space-y-3">
        {bets.map((bet) => {
          const date = new Date(bet.date);
          const formatted = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
          const wynik = mapWynikLabel(bet.wynik);
          return (
            <Card key={bet.id} className='cursor-pointer hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all' onClick={() => navigate(`/my-bets/${bet.id}`)}>
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
                    <div className={`font-medium ${wynik.className}`}>{wynik.text}</div>
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
