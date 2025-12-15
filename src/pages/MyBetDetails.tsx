import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBetslipById, type PlayerBetslipDetails } from '../services/player';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { ArrowLeft, Share2, Loader2 } from 'lucide-react';
import { createBetSlipZonePost } from '../services/betslipZone';
import { useToast } from '../hooks/use-toast';

const MyBetDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState<PlayerBetslipDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sharing, setSharing] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    getBetslipById(Number(id))
      .then((data) => {
        if (!mounted) return;
        setDetails(data);
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
  }, [id]);

  const handleShareToZoneClick = async () => {
    if (!details) return;
    setSharing(true);
    try {
      const post = await createBetSlipZonePost(details.id);
      toast({
        title: 'Kupon udostępniony',
        description: `Twój kupon został udostępniony w Strefie Kuponów jako post #${post.postId}.`,
      });
      navigate(`/betslip-zone/${post.postId}`);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Nie udało się udostępnić kuponu. Spróbuj ponownie.';
      toast({
        title: 'Nie udało się udostępnić kuponu',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setSharing(false);
    }
  };

  if (loading) return <div className="p-4">Ładowanie…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!details) return <div className="p-4">Nie znaleziono kuponu.</div>;

  const created = new Date(details.date);
  const createdText = `${created.toLocaleDateString()} ${created.toLocaleTimeString()}`;

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

  const isBetInProgress = (wynik: unknown): boolean => {
    return wynik === null || wynik === undefined || wynik === 0;
  };

  return (
    <div className="p-4 max-w-4xl mx-auto w-full mt-6">
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <Button
          variant="ghost"
          onClick={() => navigate('/my-bets')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Powrót do moich zakładów
        </Button>
        {isBetInProgress(details.wynik) && (
          <Button
            type="button"
            variant="secondary"
            disabled={sharing}
            onClick={handleShareToZoneClick}
            className="flex items-center gap-2"
          >
            {sharing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Udostępnianie…
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Udostępnij w Strefie Kuponów
              </>
            )}
          </Button>
        )}
      </div>
      <h1 className="text-4xl font-semibold mb-8">Szczegóły kuponu #{details.id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Stawka</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{details.amount.toFixed(2)} zł</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Potencjalna wygrana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{details.potentialWin.toFixed(2)} zł</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kurs łączny</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{details.totalOdds}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => { const l = mapWynikLabel(details.wynik); return (<div className={`text-lg font-medium ${l.className}`}>{l.text}</div>); })()}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Zdarzenia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {details.betSlipOdds.map((o) => {
              const d = new Date(o.event.date);
              const dt = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
              const wynik = mapWynikLabel(o.wynik);
              return (
                <div key={o.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 text-sm">
                  <div className="md:col-span-3">
                    <div className="text-gray-500">Wydarzenie</div>
                    <div className="font-medium">{o.event.name}</div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-gray-500">Grupa</div>
                    <div className="font-medium">{o.event.group ?? '-'}</div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-gray-500">Liga</div>
                    <div className="font-medium">{o.event.title ?? '-'}</div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-gray-500">Drużyna</div>
                    <div className="font-medium">{o.team.name}</div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-gray-500">Kurs</div>
                    <div className="font-medium">{o.constOdd}</div>
                  </div>
                  <div className="md:col-span-1">
                    <div className="text-gray-500">Data</div>
                    <div className="font-medium">{dt}</div>
                  </div>
                  <div className="md:col-span-6">
                    <div className="text-gray-500">Wynik zdarzenia</div>
                    <div className={`font-medium ${wynik.className}`}>{wynik.text}</div>
                  </div>
                  <div className="md:col-span-6">
                    <Separator className="my-2" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-xs text-gray-500 mt-4">Data utworzenia: {createdText}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyBetDetails;


