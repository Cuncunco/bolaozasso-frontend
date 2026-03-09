import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import type { ReactElement } from "react";

type Props = {
  children: ReactElement;
};

export function PrivateRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}