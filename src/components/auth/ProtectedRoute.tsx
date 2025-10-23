
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  // Bypass auth only in development mode
  const isDev = import.meta.env.DEV;
  const searchParams = new URLSearchParams(window.location.search);
  const bypassAuth = isDev && searchParams.get('bypass') === 'true';

  // Show loading or redirect
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  return (user || bypassAuth) ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
