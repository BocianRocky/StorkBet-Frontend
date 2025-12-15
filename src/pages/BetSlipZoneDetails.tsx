import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchBetSlipZonePost,
  type BetSlipZoneDetailsDto,
  sendBetSlipZoneReaction,
} from '../services/betslipZone';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { ArrowLeft, Flame, Snowflake, ShieldCheck, Zap, User, Calendar, Coins, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const mapWynikLabel = (
  value: unknown,
): { text: string; className: string } => {
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

const BetSlipZoneDetails: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState<BetSlipZoneDetailsDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingReaction, setSendingReaction] = useState<boolean>(false);

  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!postId) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    fetchBetSlipZonePost(Number(postId))
      .then((data) => {
        if (!mounted) return;
        setDetails(data);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Wystąpił błąd podczas pobierania kuponu');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [postId]);

  const handleReactionClick = async (reactionType: 1 | 2 | 3 | 4) => {
    if (!details) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSendingReaction(true);
    try {
      const summary = await sendBetSlipZoneReaction(details.postId, reactionType);
      setDetails((prev) =>
        prev
          ? {
              ...prev,
              fireCount: summary.fireCount,
              coldCount: summary.coldCount,
              safeCount: summary.safeCount,
              crazyCount: summary.crazyCount,
              userReaction: summary.userReaction,
            }
          : prev,
      );
    } catch (e: unknown) {
      toast({
        title: 'Błąd',
        description:
          e instanceof Error ? e.message : 'Nie udało się wysłać reakcji. Spróbuj ponownie.',
        variant: 'destructive',
      });
    } finally {
      setSendingReaction(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 max-w-4xl mx-auto w-full mt-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          <p className="text-gray-400">Ładowanie…</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto w-full mt-6">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-400">
          {error}
        </div>
      </div>
    );
  }
  if (!details) {
    return (
      <div className="p-4 max-w-4xl mx-auto w-full mt-6">
        <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-8 text-center">
          <p className="text-gray-400">Nie znaleziono kuponu.</p>
        </div>
      </div>
    );
  }

  const created = new Date(details.betSlip.date);
  const createdText = `${created.toLocaleDateString()} ${created.toLocaleTimeString()}`;

  return (
    <div className="p-4 max-w-4xl mx-auto w-full mt-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          onClick={() => navigate('/betslip-zone')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Powrót do Strefy Kuponów
        </Button>
      </div>
      <h1 className="text-3xl font-semibold mb-2 flex items-center gap-2">
        <Coins className="h-7 w-7 text-cyan-500" />
        Kupon #{details.betSlip.id} od{' '}
        <span className="flex items-center gap-1">
          <User className="h-5 w-5 text-gray-400" />
          {details.playerName} {details.playerLastName}
        </span>
      </h1>
      <p className="text-sm text-gray-500 mb-6 flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        Dodano: {createdText}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Stawka</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{details.betSlip.amount.toFixed(2)} zł</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Potencjalna wygrana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {details.betSlip.potentialWin.toFixed(2)} zł
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kurs łączny</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{details.betSlip.totalOdds}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const l = mapWynikLabel(details.betSlip.wynik);
              return <div className={`text-lg font-medium ${l.className}`}>{l.text}</div>;
            })()}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Reakcje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-500 mr-2">Co sądzisz o tym kuponie?</span>
            <Button
              type="button"
              size="sm"
              variant={details.userReaction === 1 ? 'secondary' : 'outline'}
              disabled={sendingReaction}
              onClick={() => handleReactionClick(1)}
              className={details.userReaction === 1 ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}
            >
              <Flame className={`h-4 w-4 mr-1 ${details.userReaction === 1 ? 'text-white' : 'text-orange-500'}`} />
              {details.fireCount}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={details.userReaction === 2 ? 'secondary' : 'outline'}
              disabled={sendingReaction}
              onClick={() => handleReactionClick(2)}
              className={details.userReaction === 2 ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
            >
              <Snowflake className={`h-4 w-4 mr-1 ${details.userReaction === 2 ? 'text-white' : 'text-blue-400'}`} />
              {details.coldCount}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={details.userReaction === 3 ? 'secondary' : 'outline'}
              disabled={sendingReaction}
              onClick={() => handleReactionClick(3)}
              className={details.userReaction === 3 ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
            >
              <ShieldCheck className={`h-4 w-4 mr-1 ${details.userReaction === 3 ? 'text-white' : 'text-green-500'}`} />
              {details.safeCount}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={details.userReaction === 4 ? 'secondary' : 'outline'}
              disabled={sendingReaction}
              onClick={() => handleReactionClick(4)}
              className={details.userReaction === 4 ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}
            >
              <Zap className={`h-4 w-4 mr-1 ${details.userReaction === 4 ? 'text-white' : 'text-purple-500'}`} />
              {details.crazyCount}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zdarzenia na kuponie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {details.betSlip.betSlipOdds.map((o) => {
              const d = new Date(o.event.date);
              const dt = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
              const wynik = mapWynikLabel(o.wynik);
              return (
                <div
                  key={o.id}
                  className="grid grid-cols-1 md:grid-cols-6 gap-2 text-sm"
                >
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
          <div className="text-xs text-gray-500 mt-4">
            Data utworzenia kuponu: {createdText}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BetSlipZoneDetails;


