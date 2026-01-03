import { Outlet } from "react-router-dom";

export default function AdminLayout({ onLogout }) {
  return (
    <div>
      {/* header / sidebar */}
      <Outlet />   {/* 🔥 REQUIRED */}
    </div>
  );
}
