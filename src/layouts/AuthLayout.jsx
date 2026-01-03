import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-orange-400 text-white items-center justify-center">
        <div className="max-w-md p-8">
          <h1 className="text-3xl font-bold mb-4">
            Employer–Employee Portal
          </h1>
          <p className="text-orange-100 leading-relaxed">
            Streamline IDs, tasks, invoices, payments, reports and EPFO
            requests—all from one dashboard.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 bg-orange-50">
        <div className="w-full max-w-md">
          <Outlet />

          <div className="mt-6 text-center text-sm text-gray-500">
            <Link to="/" className="hover:text-orange-600">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
