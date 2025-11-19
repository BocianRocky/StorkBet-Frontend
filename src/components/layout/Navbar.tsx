import { Button } from '@/components/ui/button'
import {Link, useNavigate} from 'react-router-dom'
// removed sheet-based login/register; using routes instead
import logo from "../../assets/logo.png";
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState, useCallback } from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getMe, type PlayerMeResponse } from '../../services/player'
import { apiService, type TyperGroup } from '../../services/api'
import { Input } from '@/components/ui/input'
const Navbar = () => {
    const { isAuthenticated, logout, login } = useAuth();
    const [me, setMe] = useState<PlayerMeResponse | null>(null);
    const [loadingMe, setLoadingMe] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [groupsSheetOpen, setGroupsSheetOpen] = useState(false);
    const [groups, setGroups] = useState<TyperGroup[]>([]);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [creatingGroup, setCreatingGroup] = useState(false);
    const [groupError, setGroupError] = useState<string | null>(null);

    const navigate = useNavigate();

    const refreshMe = useCallback(async () => {
        if (!isAuthenticated) { setMe(null); return; }
        setLoadingMe(true);
        try {
            const data = await getMe();
            setMe(data);
        } catch {
            setMe(null);
        } finally {
            setLoadingMe(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        let active = true;
        async function load() {
            if (!isAuthenticated) { setMe(null); return; }
            setLoadingMe(true);
            try {
                const data = await getMe();
                if (active) setMe(data);
            } catch {
                if (active) setMe(null);
            } finally {
                if (active) setLoadingMe(false);
            }
        }
        load();
        return () => { active = false; };
    }, [isAuthenticated]);

    useEffect(() => {
        const handleRefreshBalance = () => {
            refreshMe();
        };
        window.addEventListener('refreshBalance', handleRefreshBalance);
        return () => {
            window.removeEventListener('refreshBalance', handleRefreshBalance);
        };
    }, [refreshMe]);

    async function handleLoginSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoginError(null);
        setLoginLoading(true);
        try {
            await login({ email: loginEmail, password: loginPassword });
            setLoginOpen(false);
            setLoginEmail('');
            setLoginPassword('');
        } catch (err: any) {
            setLoginError(err?.message || 'Błąd logowania');
        } finally {
            setLoginLoading(false);
        }
    }

    const loadGroups = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoadingGroups(true);
        setGroupError(null);
        try {
            const data = await apiService.fetchMyGroups();
            setGroups(data);
        } catch (err: any) {
            setGroupError(err?.message || 'Błąd podczas pobierania grup');
            console.error('Błąd podczas pobierania grup:', err);
        } finally {
            setLoadingGroups(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (groupsSheetOpen && isAuthenticated) {
            loadGroups();
        }
    }, [groupsSheetOpen, isAuthenticated, loadGroups]);

    function handleTyperZoneClick() {
        if (!isAuthenticated) {
            setLoginOpen(true);
        } else {
            setGroupsSheetOpen(true);
        }
    }

    async function handleCreateGroup(e: React.FormEvent) {
        e.preventDefault();
        if (!newGroupName.trim()) return;
        
        setCreatingGroup(true);
        setGroupError(null);
        try {
            await apiService.createGroup({ groupName: newGroupName.trim() });
            setNewGroupName('');
            await loadGroups();
        } catch (err: any) {
            setGroupError(err?.message || 'Błąd podczas tworzenia grupy');
            console.error('Błąd podczas tworzenia grupy:', err);
        } finally {
            setCreatingGroup(false);
        }
    }

    return (
        <nav className="h-16 w-full bg-zinc-900 flex items-center justify-between px-4 shadow-[0px_10px_20px_rgba(0,0,0,0.8)] z-50 relative">
            <div className="flex-1 min-w-0">
                <img src={logo} alt="logo" className="h-10" />
            </div>
            <div className='absolute left-1/2 transform -translate-x-1/2 flex space-x-4'>
                <Link to="/"><Button variant="ghost" className="text-sm px-2 py-1 font-bold">ZAKŁADY BUKMACHERSKIE</Button></Link>
                <Link to="/promotions"><Button variant="ghost" className="text-sm px-2 py-1 font-bold">PROMOCJE</Button></Link>
                <Button variant="ghost" className="text-sm px-2 py-1 font-bold" onClick={handleTyperZoneClick}>STREFA TYPERÓW</Button>
                <Button variant="ghost" className="text-sm px-2 py-1 font-bold">STREFA KUPONÓW</Button>
                <Link to="/ranking"><Button variant="ghost" className="text-sm px-2 py-1 font-bold">RANKING</Button></Link>
            </div>

        <div className="flex-1 flex justify-end space-x-4 min-w-0">
            {isAuthenticated ? (
                <div className="flex items-center space-x-6">
                    <div className="text-sm text-white font-semibold">
                        
                        {loadingMe ? '...' : me ? `${me.name} ${me.lastName} | Saldo: ${me.accountBalance.toFixed(2)} zł` : ''}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="outline-none">
                                <Avatar className="cursor-pointer">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => navigate('/profile')} className='cursor-pointer'>Profil</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => navigate('/my-bets')} className='cursor-pointer'>Moje zakłady</DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer'>Ustawienia</DropdownMenuItem>
                            <DropdownMenuItem onClick={logout} className='cursor-pointer'>Wyloguj się</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ) : (
                <>
                <Sheet open={loginOpen} onOpenChange={setLoginOpen}>
                    <SheetTrigger asChild>
                        <Button variant="secondary" className="text-sm text-black font-bold bg-cyan-800 hover:bg-cyan-700">Zaloguj się</Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>Zaloguj się</SheetTitle>
                            <SheetClose/>
                        </SheetHeader>
                        <form onSubmit={handleLoginSubmit} className="mt-4">
                            <SheetDescription>
                                {loginError && <div className="text-red-500 text-sm mb-2">{loginError}</div>}
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full h-10 px-2 my-2 border rounded-md text-black"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Hasło"
                                    className="w-full h-10 px-2 my-2 border rounded-md text-black"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                />
                            </SheetDescription>
                            <SheetFooter>
                                <Button type="submit" disabled={loginLoading} variant="secondary" className="text-sm text-white font-bold bg-zinc-700 hover:bg-zinc-600">
                                    {loginLoading ? 'Logowanie...' : 'Zaloguj się'}
                                </Button>
                            </SheetFooter>
                        </form>
                    </SheetContent>
                </Sheet>
                <Link to="/register"><Button variant="secondary" className="text-sm text-white font-bold bg-zinc-700 hover:bg-zinc-600">Zarejestruj się</Button></Link>
                </>
            )}
        </div>

        <Sheet open={groupsSheetOpen} onOpenChange={setGroupsSheetOpen}>
            <SheetContent side="right" className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>Strefa Typerów</SheetTitle>
                    <SheetDescription>
                        Twoje grupy czatowe
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    {groupError && (
                        <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
                            {groupError}
                        </div>
                    )}
                    {loadingGroups ? (
                        <div className="text-center py-8">Ładowanie grup...</div>
                    ) : groups.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Nie należysz do żadnej grupy. Utwórz nową grupę poniżej.
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                            {groups.map((group) => (
                                <div
                                    key={group.id}
                                    onClick={() => {
                                        setGroupsSheetOpen(false);
                                        navigate(`/groups/${group.id}/chat`);
                                    }}
                                    className="border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
                                >
                                    <div className="font-semibold text-lg mb-2">{group.groupName}</div>
                                    <div className="text-sm text-muted-foreground mb-2">
                                        Członkowie: {group.members.length} | Wiadomości: {group.messageCount}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {group.members.map((member, idx) => (
                                            <span key={member.playerId}>
                                                {member.name} {member.lastName}
                                                {member.isOwner && <span className="ml-1">(Właściciel)</span>}
                                                {idx < group.members.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-8 pt-6 border-t">
                    <form onSubmit={handleCreateGroup} className="space-y-4">
                        <div>
                            <label htmlFor="groupName" className="text-sm font-medium mb-2 block">
                                Utwórz nową grupę typerów
                            </label>
                            <Input
                                id="groupName"
                                type="text"
                                placeholder="Nazwa grupy"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                disabled={creatingGroup}
                                className="w-full"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={creatingGroup || !newGroupName.trim()}
                            className="w-full"
                        >
                            {creatingGroup ? 'Tworzenie...' : 'Utwórz nową grupę'}
                        </Button>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
        </nav>
    );
}
export default Navbar;