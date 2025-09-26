import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Promotions from './pages/Promotions'
import { SportProvider } from './context/SportContext'
import { BetSlipProvider } from './context/BetSlipContext'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import MyBets from "./pages/MyBets";
import Profile from "./pages/Profile";

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
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route element={<ProtectedRoute requiredRoleId={2} />}>
                <Route path="/my-bets" element={<MyBets />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </Router>
        </BetSlipProvider>
      </SportProvider>
    </AuthProvider>
  )
}

export default App
