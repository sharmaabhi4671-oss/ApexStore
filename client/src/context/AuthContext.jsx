import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('apex_auth')) || null;
    } catch {
      return null;
    }
  });

  const login = (data) => {
    setAuth(data);
    localStorage.setItem('apex_auth', JSON.stringify(data));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('apex_auth');
  };

  return (
    <AuthContext.Provider value={{ user: auth?.user, token: auth?.token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}