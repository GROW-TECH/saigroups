import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const navigate = useNavigate(); // ✅ REQUIRED

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://projects.growtechnologies.in/srisaigroups/api/auth/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        onLogin(data); // user login success
      }
    } catch {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Sign in to your account
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={submit}>
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="
                w-full px-4 py-2.5 rounded-lg border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-orange-300
                focus:border-orange-400 text-sm
              "
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="
                w-full px-4 py-2.5 rounded-lg border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-orange-300
                focus:border-orange-400 text-sm
              "
            />
          </div>

          {/* USER SIGN IN */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-2.5 rounded-lg text-white font-medium text-sm
              bg-orange-400 hover:bg-orange-500
              transition disabled:opacity-60
            "
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* ADMIN SIGN IN (REDIRECT ONLY) */}
          <button
            type="button"
            onClick={() => navigate("/admin/login")}
            className="
              w-full py-2.5 rounded-lg text-white font-medium text-sm
              bg-gray-900 hover:bg-gray-800
              transition
            "
          >
            Admin Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
