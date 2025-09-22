import { Button } from '@/components/ui/button'
import {Link} from 'react-router-dom'
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
import logo from "../../assets/logo.png";
const Navbar = () => {
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
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="secondary" className="text-sm text-black font-bold bg-cyan-600 hover:bg-cyan-500">Zaloguj się</Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle>Zaloguj się</SheetTitle>
                        <SheetClose/>
                    </SheetHeader>
                    <SheetDescription>
                        <input type="text" placeholder="Login" className="w-full h-10 px-2 my-2 border rounded-md"/>
                        <input type="password" placeholder="Hasło" className="w-full h-10 px-2 my-2 border rounded-md"/>
                    </SheetDescription>
                    <SheetFooter>
                        <Button variant="secondary" className="text-sm text-white font-bold bg-zinc-700 hover:bg-zinc-600">Zaloguj się</Button>
                    </SheetFooter>
                </SheetContent>
        </Sheet>
            <Button variant="secondary" className="text-sm text-white font-bold bg-zinc-700 hover:bg-zinc-600">Zarejestruj się</Button>
        
        </div>
        </nav>
    );
}
export default Navbar;