// frontend/src/App.jsx

import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// We will create these page components next
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';


function App() {
  return (
    <AuthProvider>
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            {/* Add more protected routes here as needed */}
            {/* <Route path="/products/new" element={<ProtectedRoute> <AddProductPage /> </ProtectedRoute>} /> */}

        </Routes>
    </AuthProvider>
  );
}

export default App;