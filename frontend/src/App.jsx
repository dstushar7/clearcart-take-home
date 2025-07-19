// frontend/src/App.jsx

import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

// We will create these page components next
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyProductsPage from './pages/MyProductsPage';
import MainAppLayout from './layouts/MainAppLayout';
import EditProductPage from './pages/EditProductPage';
import AddProductPage from './pages/AddProductPage';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';

// Create a new component for our protected layout
const ProtectedLayout = () => (
  <ProtectedRoute>
    <MainAppLayout>
      <Outlet /> {/* Child routes will render here */}
    </MainAppLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* When user hits the base URL, navigate to a default protected page */}
      <Route path="/" element={<Navigate to="/my-products" replace />} />
      
      {/* --- Protected Routes --- */}
      {/* All routes within this element will be protected and use the MainAppLayout */}
      <Route element={<ProtectedLayout />}>
        <Route path="/my-products" element={<MyProductsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/products/edit/:productId" element={<EditProductPage />} />
      </Route>

    </Routes>
  );
}

export default App;