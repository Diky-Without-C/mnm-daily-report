import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@constants/App";
import AppLayout from "@layouts/index";

// Each page is its own chunk: only the page you open is downloaded first.
const Order = lazy(() => import("@pages/Order"));
const Stuffing = lazy(() => import("@pages/Stuffing"));
const Sales = lazy(() => import("@pages/Sales"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path={ROUTES.home}
          element={<Navigate to={ROUTES.order} replace />}
        />
        <Route path={ROUTES.order} element={<Order />} />
        <Route path={ROUTES.stuffing} element={<Stuffing />} />
        <Route path={ROUTES.sales} element={<Sales />} />
        <Route path={ROUTES.archive} element={<></>} />
      </Route>
    </Routes>
  );
}
