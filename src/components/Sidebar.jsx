import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  ClipboardIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  BanknotesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const API = "https://projects.growtechnologies.in/srisaigroups/api";

const links = [
  { to: "/", label: "Dashboard", icon: HomeIcon, roles: ["employer", "employee"] },
  { to: "/companyprofile", label: "Company Profile", icon: UserIcon, roles: ["employer", "employee"] },
  { to: "/notifications", label: "Notifications", icon: ClipboardIcon, roles: ["employer", "employee"], hasCount: "notifications" },
  { to: "/uploadforms", label: "Forms", icon: ClipboardDocumentListIcon, roles: ["employer", "employee"], hasCount: "forms" },
  { to: "/tasks", label: "Tasks", icon: Squares2X2Icon, roles: ["employer", "employee"] },

  { to: "/payslip", label: "Payslip", icon: DocumentTextIcon, roles: ["employee"] },

  { to: "/invoices", label: "Invoices", icon: DocumentTextIcon, roles: ["employer"] },
  { to: "/payments", label: "Payments", icon: CurrencyRupeeIcon, roles: ["employer"] },
  { to: "/files", label: "Attachment Files", icon: DocumentTextIcon, roles: ["employer"] },
  { to: "/addpayslip", label: "Create Payslip", icon: CurrencyRupeeIcon, roles: ["employer"] },
  { to: "/reports", label: "Reports", icon: ChartBarIcon, roles: ["employer"] },
  { to: "/epfo-requests", label: "EPFO Requests", icon: BanknotesIcon, roles: ["employer"] },
];

export default function Sidebar({ role, open, onClose }) {
  const [notifyCount, setNotifyCount] = useState(0);
  const [formsCount, setFormsCount] = useState(0);

  /* 🔔 Load NEW notifications count (only unvisited) */
  const loadNotificationCount = () => {
    if (!role) return;

    fetch(`${API}/notifications/user_notifications.php?user_type=${role}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Get previously visited notification IDs
          const visitedNotificationIds = localStorage.getItem('visitedNotificationIds') || '';
          const visitedIds = visitedNotificationIds.split(',').filter(Boolean);
          
          // Count only NEW notifications (not in visited list)
          const newNotifications = data.filter(notif => !visitedIds.includes(String(notif.id)));
          setNotifyCount(newNotifications.length);
        }
      })
      .catch(err => console.error("Notification count error:", err));
  };

  /* 📝 Load NEW forms count (only unvisited forms) */
  const loadFormsCount = () => {
    fetch(`${API}/forms/list.php`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Get previously visited form IDs
          const visitedFormIds = localStorage.getItem('visitedFormIds') || '';
          const visitedIds = visitedFormIds.split(',').filter(Boolean);
          
          // Count only NEW forms (forms not in visited list)
          const newForms = data.filter(form => !visitedIds.includes(String(form.id)));
          setFormsCount(newForms.length);
        }
      })
      .catch(err => console.error("Forms count error:", err));
  };

  /* Initial load */
  useEffect(() => {
    loadNotificationCount();
  }, [role]);

  useEffect(() => {
    loadFormsCount();
  }, []);

  /* 🔄 Listen for localStorage changes to update counts in real-time */
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Update notification count when visitedNotificationIds changes
      if (e.key === 'visitedNotificationIds') {
        loadNotificationCount();
      }
      // Update forms count when visitedFormIds changes
      if (e.key === 'visitedFormIds') {
        loadFormsCount();
      }
    };

    // Listen for storage events (works across tabs)
    window.addEventListener('storage', handleStorageChange);

    // Custom event for same-tab updates
    const handleCustomStorageChange = (e) => {
      if (e.detail === 'visitedNotificationIds') {
        loadNotificationCount();
      }
      if (e.detail === 'visitedFormIds') {
        loadFormsCount();
      }
    };

    window.addEventListener('localStorageUpdated', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdated', handleCustomStorageChange);
    };
  }, [role]);

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
            .map((link, index) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={index}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </div>

                  {/* 🔴 NOTIFICATIONS COUNT */}
                  {link.hasCount === "notifications" && notifyCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold min-w-[18px] h-5 flex items-center justify-center rounded-full px-1.5">
                      {notifyCount}
                    </span>
                  )}

                  {/* 🔵 FORMS COUNT */}
                  {link.hasCount === "forms" && formsCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs font-bold min-w-[18px] h-5 flex items-center justify-center rounded-full px-1.5">
                      {formsCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
        </nav>
      </aside>
    </>
  );
}