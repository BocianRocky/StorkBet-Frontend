import { useEffect, useState } from 'react';
import { getProfile, type PlayerProfileResponse, deposit, withdrawal } from '../services/player';
import { getMyPromotions, type PromotionForUser } from '../services/promotions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
    const [data, setData] = useState<PlayerProfileResponse | null>(null);
    const [promos, setPromos] = useState<PromotionForUser[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [promosError, setPromosError] = useState<string | null>(null);
    
    // Deposit/Withdrawal state
    const [depositAmount, setDepositAmount] = useState<number>(0);
    const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
    const [depositing, setDepositing] = useState(false);
    const [withdrawing, setWithdrawing] = useState(false);
    const [depositError, setDepositError] = useState<string | null>(null);
    const [withdrawalError, setWithdrawalError] = useState<string | null>(null);
    const { toast } = useToast();

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

    const handleDeposit = async () => {
        if (depositAmount <= 0) {
            setDepositError('Kwota musi być większa od 0');
            return;
        }
        setDepositing(true);
        setDepositError(null);
        try {
            await deposit(depositAmount, 1);
            toast({
                variant: "success",
                title: "Wpłata zakończona!",
                description: `Wpłacono ${depositAmount.toFixed(2)} zł na konto.`,
            });
            setDepositAmount(0);
            // Refresh profile data
            const updatedData = await getProfile();
            setData(updatedData);
            // Refresh balance in navbar
            window.dispatchEvent(new Event('refreshBalance'));
        } catch (e: any) {
            setDepositError(e?.message || 'Nie udało się zrealizować wpłaty');
            toast({
                variant: "destructive",
                title: "Błąd wpłaty",
                description: e?.message || 'Nie udało się zrealizować wpłaty',
            });
        } finally {
            setDepositing(false);
        }
    };

    const handleWithdrawal = async () => {
        if (withdrawalAmount <= 0) {
            setWithdrawalError('Kwota musi być większa od 0');
            return;
        }
        if (!data || withdrawalAmount > data.accountBalance) {
            setWithdrawalError('Niewystarczające środki na koncie');
            return;
        }
        setWithdrawing(true);
        setWithdrawalError(null);
        try {
            await withdrawal(withdrawalAmount, 2);
            toast({
                variant: "success",
                title: "Wypłata zakończona!",
                description: `Wypłacono ${withdrawalAmount.toFixed(2)} zł z konta.`,
            });
            setWithdrawalAmount(0);
            // Refresh profile data
            const updatedData = await getProfile();
            setData(updatedData);
            // Refresh balance in navbar
            window.dispatchEvent(new Event('refreshBalance'));
        } catch (e: any) {
            setWithdrawalError(e?.message || 'Nie udało się zrealizować wypłaty');
            toast({
                variant: "destructive",
                title: "Błąd wypłaty",
                description: e?.message || 'Nie udało się zrealizować wypłaty',
            });
        } finally {
            setWithdrawing(false);
        }
    };

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
                        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                            <div>
                                <div className="text-gray-500">Saldo</div>
                                <div className="font-medium text-lg">{data.accountBalance.toFixed(2)} zł</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Waluta</div>
                                <div className="font-medium">PLN</div>
                            </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="depositAmount" className="text-sm font-semibold">Wpłata</Label>
                                <div className="flex gap-2 mt-2">
                                    <Input
                                        id="depositAmount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={depositAmount === 0 ? "" : depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value === "" ? 0 : Number(e.target.value))}
                                        placeholder="Kwota"
                                        className="flex-1"
                                        disabled={depositing}
                                    />
                                    <Button 
                                        onClick={handleDeposit} 
                                        disabled={depositing || depositAmount <= 0}
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        {depositing ? 'Wysyłanie...' : 'Wpłać'}
                                    </Button>
                                </div>
                                {depositError && <div className="text-red-600 text-sm mt-1">{depositError}</div>}
                            </div>
                            
                            <div>
                                <Label htmlFor="withdrawalAmount" className="text-sm font-semibold">Wypłata</Label>
                                <div className="flex gap-2 mt-2">
                                    <Input
                                        id="withdrawalAmount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={withdrawalAmount === 0 ? "" : withdrawalAmount}
                                        onChange={(e) => setWithdrawalAmount(e.target.value === "" ? 0 : Number(e.target.value))}
                                        placeholder="Kwota"
                                        className="flex-1"
                                        disabled={withdrawing}
                                    />
                                    <Button 
                                        onClick={handleWithdrawal} 
                                        disabled={withdrawing || withdrawalAmount <= 0 || (data && withdrawalAmount > data.accountBalance)}
                                        className="bg-rose-600 hover:bg-rose-700"
                                    >
                                        {withdrawing ? 'Wysyłanie...' : 'Wypłać'}
                                    </Button>
                                </div>
                                {withdrawalError && <div className="text-red-600 text-sm mt-1">{withdrawalError}</div>}
                                {data && withdrawalAmount > data.accountBalance && (
                                    <div className="text-amber-600 text-sm mt-1">Niewystarczające środki na koncie</div>
                                )}
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
