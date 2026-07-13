import React, { createContext, useState, useEffect, useContext } from "react";
import { getMe, loginUser, registerUser } from "../routes/mediaRoutes";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("blogbase_token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await getMe();
          setUser(res.data);
        } catch (err) {
          console.error("Auth validation failed:", err);
          // Token expired or invalid
          logout();
        }
      }
      setIsLoading(false);
    };

    fetchCurrentUser();
    // eslint-disable-next-line
  }, [token]);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await loginUser(credentials);
      const { token: receivedToken, user: loggedUser } = res.data;
      localStorage.setItem("blogbase_token", receivedToken);
      setToken(receivedToken);
      setUser(loggedUser);
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      setIsLoading(false);
      return {
        success: false,
        error: err.response?.data?.error || "Login failed. Please check credentials.",
      };
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const res = await registerUser(userData);
      const { token: receivedToken, user: registeredUser } = res.data;
      localStorage.setItem("blogbase_token", receivedToken);
      setToken(receivedToken);
      setUser(registeredUser);
      return { success: true };
    } catch (err) {
      console.error("Registration failed:", err);
      setIsLoading(false);
      return {
        success: false,
        error: err.response?.data?.error || "Registration failed.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("blogbase_token");
    setToken(null);
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
