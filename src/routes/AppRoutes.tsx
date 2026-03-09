import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../pages/login/Index";
import Register from "../pages/register/Index";
import Pools from "../pages/pools/Index";
import NewPool from "../pages/newPool/Index";
import Find from "../pages/find/index";
import Calendar from "../pages/calendar/index";
import Profile from "../pages/profile/Index";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import AppLayout from "../layout/AppLayout";
import PoolDetails from "../pages/poolDetails/Index";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Navigate to="/pools" replace />} />
        <Route path="/pools" element={<Pools />} />
        <Route path="/pools/:id" element={<PoolDetails />} />
        <Route path="/new" element={<NewPool />} />
        <Route path="/find" element={<Find />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/pools" replace />} />
    </Routes>
  );
}