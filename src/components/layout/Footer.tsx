import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="w-full bg-zinc-950 text-neutral-300 border-t border-zinc-800 mt-12" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="text-neutral-100 font-semibold text-sm tracking-wide mb-3">StorkBet</h3>
          <p className="text-sm text-neutral-400 leading-6">
            Zakłady bukmacherskie online. Kursy na żywo, szybkie wypłaty i promocje dla nowych i stałych graczy.
          </p>
        </div>

        <nav aria-label="Nawigacja serwisu" className="text-sm">
          <h4 className="text-neutral-200 font-medium mb-3">Nawigacja</h4>
          <ul className="space-y-2">
            <li><Link className="hover:text-white" to="/">Zakłady</Link></li>
            <li><Link className="hover:text-white" to="/promotions">Promocje</Link></li>
            <li><Link className="hover:text-white" to="/my-bets">Moje zakłady</Link></li>
            <li><Link className="hover:text-white" to="/profile">Profil</Link></li>
          </ul>
        </nav>

        <div className="text-sm" aria-labelledby="footer-help">
          <h4 id="footer-help" className="text-neutral-200 font-medium mb-3">Pomoc</h4>
          <ul className="space-y-2">
            <li><a className="hover:text-white" href="#">FAQ</a></li>
            <li><Link className="hover:text-white" to="/contact">Kontakt</Link></li>
            <li><a className="hover:text-white" href="#">Odpowiedzialna gra</a></li>
            <li><a className="hover:text-white" href="#">Zasady i regulaminy</a></li>
          </ul>
        </div>

        <div className="text-sm" aria-labelledby="footer-security">
          <h4 id="footer-security" className="text-neutral-200 font-medium mb-3">Płatności i bezpieczeństwo</h4>
          <ul className="space-y-2 text-neutral-400">
            <li>Szyfrowanie TLS 1.3</li>
            <li>Szybkie wypłaty</li>
            <li>Weryfikacja KYC</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 justify-between">
          <p className="text-xs text-neutral-500">
            18+ Graj odpowiedzialnie. Hazard wiąże się z ryzykiem uzależnienia. W przypadku problemów skontaktuj się z podmiotami pomocowymi.
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <Link className="hover:text-white" to="/legal?tab=polityka">Polityka prywatności</Link>
            <span className="opacity-40">•</span>
            <Link className="hover:text-white" to="/legal?tab=regulamin">Regulamin</Link>
            <span className="opacity-40">•</span>
            <span>© {new Date().getFullYear()} StorkBet</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


