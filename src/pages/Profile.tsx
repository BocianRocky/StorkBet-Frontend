import { useEffect, useState } from 'react';
import { getProfile, type PlayerProfileResponse } from '../services/player';
import { getMyPromotions, type PromotionForUser } from '../services/promotions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
    const [data, setData] = useState<PlayerProfileResponse | null>(null);
    const [promos, setPromos] = useState<PromotionForUser[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [promosError, setPromosError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await getProfile();
                if (active) setData(res);
            } catch (e: any) {
                if (active) setError(e?.message || 'Błąd ładowania profilu');
            } finally {
                if (active) setLoading(false);
            }
        }
        load();
        return () => { active = false; };
    }, []);

    useEffect(() => {
        let mounted = true;
        getMyPromotions()
          .then((list) => { if (mounted) { setPromos(list); setPromosError(null); } })
          .catch((e: unknown) => { if (mounted) setPromosError(e instanceof Error ? e.message : 'Błąd pobierania promocji'); });
        return () => { mounted = false };
    }, []);

    if (loading) return <div className="p-4">Ładowanie…</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!data) return <div className="p-4">Brak danych profilu</div>;

    return (
        <div className="p-4 max-w-5xl mx-auto w-full mt-6">
            <h1 className="text-4xl font-semibold mb-8">Mój profil</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Dane osobowe</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-gray-500">Imię</div>
                                <div className="font-medium">{data.name}</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Nazwisko</div>
                                <div className="font-medium">{data.lastName}</div>
                            </div>
                            <div className="col-span-2">
                                <div className="text-gray-500">Email</div>
                                <div className="font-medium break-all">{data.email}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Finanse</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-gray-500">Saldo</div>
                                <div className="font-medium">{data.accountBalance.toFixed(2)} zł</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Waluta</div>
                                <div className="font-medium">PLN</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Dostępne promocje</CardTitle>
                </CardHeader>
                <CardContent>
                    {promosError && <div className="text-red-600">{promosError}</div>}
                    {!promosError && (!promos || promos.length === 0) && (
                        <div className="text-sm text-gray-500">Brak dostępnych promocji.</div>
                    )}
                    <div className="space-y-3">
                        {(promos ?? []).map((p) => (
                            <div key={p.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 text-sm">
                                <div className="md:col-span-2">
                                    <div className="text-gray-500">Nazwa promocji</div>
                                    <div className="font-medium">{p.promotionName}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Typ bonusu</div>
                                    <div className="font-medium">{p.bonusType} {p.bonusValue}%</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Kod</div>
                                    <div className="font-medium">{p.promoCode ?? '-'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Okres</div>
                                    <div className="font-medium">{p.dateStart} – {p.dateEnd}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Dostępność</div>
                                    <div className="font-medium">{p.availability}</div>
                                </div>
                                <div className="md:col-span-6">
                                    <div className="text-gray-500">Opis</div>
                                    <div className="font-medium text-gray-800">{p.description}</div>
                                </div>
                                <div className="md:col-span-6">
                                    <Separator className="my-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Profile;
