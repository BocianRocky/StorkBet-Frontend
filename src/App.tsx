import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Promotions from './pages/Promotions'
import { SportProvider } from './context/SportContext'
import { BetSlipProvider } from './context/BetSlipContext'

function App() {
  
  return (
    <SportProvider>
      <BetSlipProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/promotions" element={<Promotions></Promotions>}/>
          </Routes>
        </Router>
      </BetSlipProvider>
    </SportProvider>
  )
}

export default App
