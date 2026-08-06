import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@contexts/AuthContext";

import Loader from "@components/common/Loader";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader text="Проверка авторизации..." />;
  }

  return user ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;
