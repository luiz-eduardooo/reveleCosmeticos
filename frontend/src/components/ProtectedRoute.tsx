import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { estaLogado } = useAuth();

  if (!estaLogado) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}