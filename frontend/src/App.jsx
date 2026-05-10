import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Donors from './pages/Donors';
import Patients from './pages/Patients';
import Requests from './pages/Requests';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donors" element={<Donors />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/requests" element={<Requests />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;