import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@layouts/index";
import Order from "@pages/Order";
import Stuffing from "@pages/Stuffing";
import Sales from "@pages/Sales";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/order" replace />} />
        <Route path="/order" element={<Order />} />
        <Route path="/stuffing" element={<Stuffing />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/archive" element={<></>} />
      </Route>
    </Routes>
  );
}
