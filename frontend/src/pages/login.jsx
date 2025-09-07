import { useState } from "react";
import api from "../api/api"; // centralized Axios instance
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Get CSRF cookie
      await api.get("/sanctum/csrf-cookie");

      // Attempt login
      const loginRes = await api.post("/api/login", {
        login: identifier,
        password,
      });

      if (loginRes.status !== 200 && loginRes.status !== 204) {
        throw new Error("Login failed");
      }

      // Fetch authenticated user
      const { data: user } = await api.get("/api/user");
      //console.log('I am', user);
      //console.log('role from server:', user.role, typeof user.role);
      // Role-based redirect
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "service_user":
          navigate("/service/dashboard");
          break;
        case "oic":
          navigate("/oic/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err.response || err);
      setError(err.response?.data?.message || "Invalid credentials or login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">Login</h2>

        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email or Username"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
