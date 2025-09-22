import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Promotions from './pages/Promotions'
import { SportProvider } from './context/SportContext'

function App() {
  
  return (
    <SportProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/promotions" element={<Promotions></Promotions>}/>
        </Routes>
      </Router>
    </SportProvider>
  )
}

export default App
