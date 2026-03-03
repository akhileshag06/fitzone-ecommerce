import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard';
import MyProduct from './Myproduct';
import AdminPanel from './AdminPanel';
import DealerPanel from './DealerPanel';
import DealerRegister from './DealerRegister';
import TestEnhancements from './TestEnhancements';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Myproduct" element={<MyProduct />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dealer" element={<DealerPanel />} />
        <Route path="/dealer/register" element={<DealerRegister />} />
        {/* NEW ROUTE - Test all enhancements here! */}
        <Route path="/test" element={<TestEnhancements />} />
      </Routes>
    </Router>
  );
}

export default App;