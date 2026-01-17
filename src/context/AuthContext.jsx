import { useState } from "react";
import { AuthContext } from "../components/hooks/useAuth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser.email ? parsedUser : null;
      }
      return null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = (
    email,
    //password
  ) => {
    const mockUser = { email, name: "John Doe" };
    localStorage.setItem("user", JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
