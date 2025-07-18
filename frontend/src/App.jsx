// frontend/src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// We will create these page components next
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyProductsPage from './pages/MyProductsPage';
import MainAppLayout from './layouts/MainAppLayout';
import EditProductPage from './pages/EditProductPage';

function App() {
  return (
    <Routes>
      {/* If a user is logged in, they will be directed to /my-products */}
      {/* If not, they will be redirected to /login by the ProtectedRoute */}
      <Route path="/" element={<Navigate to="/my-products" replace />} />

      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* This route is now protected */}
      <Route
        path="/my-products"
        element={
          <ProtectedRoute>
            <MainAppLayout>
              <MyProductsPage />
            </MainAppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/edit/:productId"
        element={
          <ProtectedRoute>
            <MainAppLayout>
              <EditProductPage />
            </MainAppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;