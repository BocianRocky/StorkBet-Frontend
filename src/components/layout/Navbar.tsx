import { Button } from '@/components/ui/button'
import {Link} from 'react-router-dom'
// removed sheet-based login/register; using routes instead
import logo from "../../assets/logo.png";
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
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
const Navbar = () => {
    const { isAuthenticated, logout, login } = useAuth();
    const [me, setMe] = useState<PlayerMeResponse | null>(null);
    const [loadingMe, setLoadingMe] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

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

    return (
        <nav className="h-16 w-full bg-zinc-900 flex items-center justify-between px-4 shadow-[0px_10px_20px_rgba(0,0,0,0.8)] z-50 relative">
            <div className="flex-1 min-w-0">
                <img src={logo} alt="logo" className="h-10" />
            </div>
            <div className='absolute left-1/2 transform -translate-x-1/2 flex space-x-4'>
                <Link to="/"><Button variant="ghost" className="text-sm px-2 py-1 font-bold">ZAKŁADY BUKMACHERSKIE</Button></Link>
                <Link to="/promotions"><Button variant="ghost" className="text-sm px-2 py-1 font-bold">PROMOCJE</Button></Link>
                <Button variant="ghost" className="text-sm px-2 py-1 font-bold">STREFA TYPERA</Button>
                <Button variant="ghost" className="text-sm px-2 py-1 font-bold">STREFA KUPONÓW</Button>
                <Button variant="ghost" className="text-sm px-2 py-1 font-bold">RANKING</Button>
            </div>

        <div className="flex-1 flex justify-end space-x-4 min-w-0">
            {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                    
                    
                    <Button variant="secondary" className="text-sm text-white font-bold bg-zinc-700 hover:bg-zinc-600" onClick={logout}>Wyloguj</Button>
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
                        <DropdownMenuItem>Profil</DropdownMenuItem>
                        <DropdownMenuItem>Ustawienia</DropdownMenuItem>
                        <DropdownMenuItem>Wyloguj się</DropdownMenuItem>
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
        </nav>
    );
}
export default Navbar;