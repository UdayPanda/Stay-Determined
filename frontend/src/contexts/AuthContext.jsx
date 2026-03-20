import { useContext, createContext, useState, useEffect } from "react";
import { apiClient } from "../lib/apiClient";
import { LOGIN_ME_ROUTE, LOGIN_ROUTE, LOGOUT_ROUTE } from "../utils/constants";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await apiClient.get(LOGIN_ME_ROUTE, {
        withCredentials: true,
      });

      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const setSession = (nextUser, token) => {
    if (token) localStorage.setItem("token", token);
    setUser(nextUser || null);
  };

  const login = async (credentials) => {
    const res = await apiClient.post(LOGIN_ROUTE, credentials, {
      withCredentials: true,
    });
    setSession(res.data.user, res.data.token);
    return res;
  };

  const logout = async () => {
    try {
      await apiClient.post(
        LOGOUT_ROUTE,
        {},
        {
          withCredentials: true,
        },
      );
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
