import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchRanking, type RankingPlayer } from "@/services/player";

const Ranking = () => {
    const [ranking, setRanking] = useState<RankingPlayer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchRanking(30)
            .then((data) => {
                if (mounted) {
                    setRanking(Array.isArray(data) ? data : []);
                    setError(null);
                }
            })
            .catch((e: unknown) => {
                if (mounted) setError(e instanceof Error ? e.message : "Nieznany błąd");
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="w-full flex items-center justify-center py-10 text-muted-foreground">
                Ładowanie rankingu...
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full flex items-center justify-center py-10 text-red-400">
                Błąd podczas pobierania rankingu: {error}
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-semibold mb-8 mt-6 text-white">Ranking Graczy</h1>
            <Card className="bg-neutral-950 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-2xl text-white">Top 30 Graczy</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-800">
                                    <th className="text-left py-3 px-4 text-white font-semibold">Pozycja</th>
                                    <th className="text-left py-3 px-4 text-white font-semibold">Imię</th>
                                    <th className="text-left py-3 px-4 text-white font-semibold">Nazwisko</th>
                                    <th className="text-right py-3 px-4 text-white font-semibold">Wynik</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ranking.map((player, index) => (
                                    <tr 
                                        key={player.id} 
                                        className="border-b border-neutral-800 hover:bg-neutral-900 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-white font-semibold">
                                            {index + 1}
                                        </td>
                                        <td className="py-3 px-4 text-white">
                                            {player.name}
                                        </td>
                                        <td className="py-3 px-4 text-white">
                                            {player.lastName}
                                        </td>
                                        <td className="py-3 px-4 text-right text-white font-semibold">
                                            {player.score.toFixed(4)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {ranking.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                Brak danych w rankingu
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Ranking;

