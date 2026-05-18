import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/layout/AppLayout";
import Order from "@/layout/pages/Order";
import Stuffing from "@/layout/pages/Stuffing";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/order" replace />} />
        <Route path="/order" element={<Order />} />
        <Route path="/stuffing" element={<Stuffing />} />
      </Route>
    </Routes>
  );
}
