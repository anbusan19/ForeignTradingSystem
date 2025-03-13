import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { CurrencyChart } from './pages/CurrencyChart';
import { Dashboard } from './pages/Dashboard';
import { ExchangeRates } from './pages/ExchangeRates';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { PaymentCancel } from './pages/PaymentCancel';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { Register } from './pages/Register';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/exchange-rates" element={<ExchangeRates />} />
            <Route path="/exchange-rates/chart/:currency" element={<CurrencyChart />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;