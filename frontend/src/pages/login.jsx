import { useState } from "react";
import api from "../api/api"; // centralized Axios instance
import { useNavigate } from "react-router-dom";
import btrlogo from '../assets/btrlogo.png';
import btrlegpics from '../assets/btrlegpics.jpg';
import { Link } from "react-router-dom";


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
    <div className="min-h-screen flex items-center justify-center relative">
      
      {/* background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${btrlegpics})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* yellow overlay */}
      <div className="absolute inset-0 bg-[#FCFC62] opacity-90"></div>
      
      {/* login form */}
      <form
        onSubmit={handleLogin}
        className="relative p-6 space-y-4 w-full max-w-sm rounded-lg bg-white"
        style={{ boxShadow: "0 4px 50px rgba(0, 0, 0, 0.3)" }}
      >
        {/* logo and title */}
        <img src={btrlogo} alt="Logo" className="mx-auto w-24 h-24" />
        <h2 className="text-xl font-bold text-gray-800 text-center">Login</h2>

        {/* username */}
        <div className="flex flex-col items-start space-y-2">
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Username or Email"
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-yellow-400"
        />
        </div>

        {/* password */}
        <div className="flex flex-col items-start space-y-2">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-yellow-400"
        />

          {/* forgot password */}
          <div className="text-sm text-right -mt-2 mb-2">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline font-semibold"
            >
              Forgot password?
            </Link>
          </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
        
        {/* login button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-bold rounded ${
            loading ? "bg-gray-400" : "bg-yellow-400 hover:bg-yellow-500"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* register Link */}
        <p className="text-center text-sm">
          Don’t have an account?{" "}
            <Link to="/register/admin" className="text-blue-600 hover:underline font-medium">
            Register
            </Link>
        </p>


      </form>
    </div>
  );
}
