import { useEffect, useState } from 'react';
import { getProfile, type PlayerProfileResponse } from '../services/player';

const Profile = () => {
    const [data, setData] = useState<PlayerProfileResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <div className="p-4 text-white">Ładowanie...</div>;
    if (error) return <div className="p-4 text-red-400">{error}</div>;
    if (!data) return <div className="p-4 text-white">Brak danych profilu</div>;

    return (
        <div className="p-6 text-white max-w-xl">
            <h1 className="text-2xl font-bold mb-4">Profil</h1>
            <div className="space-y-2">
                <div><span className="text-zinc-400">Imię:</span> {data.name}</div>
                <div><span className="text-zinc-400">Nazwisko:</span> {data.lastName}</div>
                <div><span className="text-zinc-400">Email:</span> {data.email}</div>
                <div><span className="text-zinc-400">Saldo:</span> {data.accountBalance.toFixed(2)} zł</div>
            </div>
        </div>
    );
}

export default Profile;
