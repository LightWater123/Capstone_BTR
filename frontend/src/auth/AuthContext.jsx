import { createContext, useContext, useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import api from "../api/api";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    async function run() {
      if (user === undefined) {
        const res = await api.get("/api/verifyUser");
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          throw new Error("no user data");
        }
      }
    }
    run().catch(() => {
      setUser(null);
      redirect("/");
    });
  }, [user]);

  const login = async (user, password) => {
    const response = await api.post("/api/login", {
      login: user,
      password,
    });
    if (response.data) {
      setUser(response.data.user);
      return response.data;
    } else {
      setUser(null);
      return null;
    }
  };

  const logout = async (user, password) => {
    const response = await api.post("/api/logout");
    setUser(null);
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
