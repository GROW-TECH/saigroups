import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  ClipboardIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  IdentificationIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  BanknotesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const links = [
  { to: "/", label: "Dashboard", icon: HomeIcon, roles: ["employer", "employee"] },
  { to: "/profile", label: "Profile", icon: UserIcon, roles: ["employer", "employee"] },
  { to: "/notifications", label: "Notifications", icon: ClipboardIcon, roles: ["employer", "employee"] },
  { to: "/tasks", label: "Tasks", icon: Squares2X2Icon, roles: ["employer", "employee"] },

  { to: "/forms", label: "Forms", icon: ClipboardDocumentListIcon, roles: ["employee"] },
  { to: "/payslip", label: "Payslip", icon: DocumentTextIcon, roles: ["employee"] },

  { to: "/id-creation", label: "Add Employee", icon: IdentificationIcon, roles: ["employer"] },
  { to: "/invoices", label: "Invoices", icon: DocumentTextIcon, roles: ["employer"] },
  { to: "/payments", label: "Payments", icon: CurrencyRupeeIcon, roles: ["employer"] },
  { to: "/addpayslip", label: "Create Payslip", icon: CurrencyRupeeIcon, roles: ["employer"] },
  { to: "/reports", label: "Reports", icon: ChartBarIcon, roles: ["employer"] },
  { to: "/epfo-requests", label: "EPFO Requests", icon: BanknotesIcon, roles: ["employer"] },
];

export default function Sidebar({ role, open, onClose }) {
  return (
    <>
      {/* OVERLAY (MOBILE) */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static z-50 lg:z-auto top-0 left-0 h-full w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* MOBILE HEADER */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b">
          <span className="font-semibold text-orange-600">Menu</span>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* LINKS */}
        <nav className="p-4 space-y-1">
          {links
            .filter((link) => link.roles.includes(role))
            .map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose} // close on mobile click
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
        </nav>
      </aside>
    </>
  );
}
