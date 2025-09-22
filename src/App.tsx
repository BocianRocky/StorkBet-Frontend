import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Promotions from './pages/Promotions'
function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/promotions" element={<Promotions></Promotions>}/>
      </Routes>
  </Router>
  )
}

export default App
