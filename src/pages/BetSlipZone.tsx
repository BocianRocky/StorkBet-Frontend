import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchBetSlipZoneFeed,
  type BetSlipZoneItemDto,
  type BetSlipZoneSortBy,
  sendBetSlipZoneReaction,
} from '../services/betslipZone';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { Flame, Snowflake, ShieldCheck, Zap, ArrowUpDown, User, Calendar, Coins, TrendingUp, Loader2 } from 'lucide-react';

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

const BetSlipZone: React.FC = () => {
  const [posts, setPosts] = useState<BetSlipZoneItemDto[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page] = useState<number>(1);
  const [sortBy, setSortBy] = useState<BetSlipZoneSortBy>('reactions');
  const [sendingReactionFor, setSendingReactionFor] = useState<number | null>(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetchBetSlipZoneFeed(page, 20, sortBy)
      .then((data) => {
        if (!mounted) return;
        setPosts(data);
      })
      .catch((e: unknown) => {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Wystąpił błąd podczas pobierania kuponów');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [page, sortBy]);

  const handleReactionClick = async (post: BetSlipZoneItemDto, reactionType: 1 | 2 | 3 | 4) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSendingReactionFor(post.postId);
    try {
      const summary = await sendBetSlipZoneReaction(post.postId, reactionType);
      setPosts((prev) =>
        prev
          ? prev.map((p) =>
              p.postId === post.postId
                ? {
                    ...p,
                    fireCount: summary.fireCount,
                    coldCount: summary.coldCount,
                    safeCount: summary.safeCount,
                    crazyCount: summary.crazyCount,
                    userReaction: summary.userReaction,
                  }
                : p,
            )
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
      setSendingReactionFor(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 max-w-5xl mx-auto w-full mt-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          <p className="text-gray-400">Ładowanie Strefy Kuponów…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-5xl mx-auto w-full mt-6">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="p-4 max-w-5xl mx-auto w-full mt-6">
        <h1 className="text-3xl font-semibold mb-4">Strefa Kuponów</h1>
        <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-8 text-center">
          <p className="text-gray-400">Brak aktywnych kuponów do wyświetlenia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto w-full mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-cyan-500" />
          Strefa Kuponów
        </h1>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-400">Sortuj według:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as BetSlipZoneSortBy)}
            className="bg-zinc-900 border border-zinc-700 text-sm rounded px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="reactions">liczby reakcji</option>
            <option value="time">czasu dodania</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {posts.map((post) => {
          const created = new Date(post.createdAt);
          const createdText = `${created.toLocaleDateString()} ${created.toLocaleTimeString()}`;
          const wynik = mapWynikLabel(post.wynik);

          return (
            <Card
              key={post.postId}
              className="cursor-pointer hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all"
              onClick={() => navigate(`/betslip-zone/${post.postId}`)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-cyan-500" />
                    Kupon #{post.betSlipId} od{' '}
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4 text-gray-400" />
                      {post.playerName} {post.playerLastName}
                    </span>
                  </span>
                  <span className="text-sm font-normal text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {createdText}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 items-center text-sm">
                  <div className="col-span-1 md:col-span-1">
                    <div className="text-gray-500">Stawka</div>
                    <div className="font-medium">{post.amount.toFixed(2)} zł</div>
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <div className="text-gray-500">Kurs łączny</div>
                    <div className="font-medium">{post.totalOdds}</div>
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <div className="text-gray-500">Potencjalna wygrana</div>
                    <div className="font-medium">{post.potentialWin.toFixed(2)} zł</div>
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <div className="text-gray-500">Liczba zdarzeń</div>
                    <div className="font-medium">{post.oddsCount}</div>
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <div className="text-gray-500">Status kuponu</div>
                    <div className={`font-medium ${wynik.className}`}>{wynik.text}</div>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-gray-500 mr-2">Reakcje:</span>
                  <Button
                    type="button"
                    size="sm"
                    variant={post.userReaction === 1 ? 'secondary' : 'outline'}
                    disabled={sendingReactionFor === post.postId}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReactionClick(post, 1);
                    }}
                    className={post.userReaction === 1 ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}
                  >
                    <Flame className={`h-4 w-4 mr-1 ${post.userReaction === 1 ? 'text-white' : 'text-orange-500'}`} />
                    {post.fireCount}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={post.userReaction === 2 ? 'secondary' : 'outline'}
                    disabled={sendingReactionFor === post.postId}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReactionClick(post, 2);
                    }}
                    className={post.userReaction === 2 ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                  >
                    <Snowflake className={`h-4 w-4 mr-1 ${post.userReaction === 2 ? 'text-white' : 'text-blue-400'}`} />
                    {post.coldCount}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={post.userReaction === 3 ? 'secondary' : 'outline'}
                    disabled={sendingReactionFor === post.postId}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReactionClick(post, 3);
                    }}
                    className={post.userReaction === 3 ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                  >
                    <ShieldCheck className={`h-4 w-4 mr-1 ${post.userReaction === 3 ? 'text-white' : 'text-green-500'}`} />
                    {post.safeCount}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={post.userReaction === 4 ? 'secondary' : 'outline'}
                    disabled={sendingReactionFor === post.postId}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReactionClick(post, 4);
                    }}
                    className={post.userReaction === 4 ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}
                  >
                    <Zap className={`h-4 w-4 mr-1 ${post.userReaction === 4 ? 'text-white' : 'text-purple-500'}`} />
                    {post.crazyCount}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default BetSlipZone;


