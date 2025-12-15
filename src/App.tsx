import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import Home from './pages/Home'
import Promotions from './pages/Promotions'
import { SportProvider } from './context/SportContext'
import { BetSlipProvider } from './context/BetSlipContext'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import MyBets from "./pages/MyBets";
import MyBetDetails from "./pages/MyBetDetails";
import Profile from "./pages/Profile";
import Legal from "./pages/Legal";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import GroupChat from "./pages/GroupChat";
import Ranking from "./pages/Ranking";
import { Toaster } from "./components/ui/toaster";

function App() {
  
  return (
    <AuthProvider>
      <SportProvider>
        <BetSlipProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Public routes - dostępne tylko dla niezalogowanych lub graczy (admini są przekierowywani) */}
              <Route element={<PublicRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/contact" element={<Contact />} />
              </Route>
              <Route element={<ProtectedRoute requiredRoleId={2} />}>
                <Route path="/my-bets" element={<MyBets />} />
                <Route path="/my-bets/:id" element={<MyBetDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/groups/:groupId/chat" element={<GroupChat />} />
              </Route>
              <Route element={<ProtectedRoute requiredRoleId={1} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
            <Footer />
            <Toaster />
          </Router>
        </BetSlipProvider>
      </SportProvider>
    </AuthProvider>
  )
}

export default App
