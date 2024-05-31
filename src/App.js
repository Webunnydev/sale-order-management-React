import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SaleOrders from './pages/SaleOrders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SaleOrders" element={<SaleOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
