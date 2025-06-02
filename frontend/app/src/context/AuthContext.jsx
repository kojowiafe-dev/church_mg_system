import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('accessToken') || null,
    role: localStorage.getItem('role') || null,
    username: localStorage.getItem('username') || null,
  });

  const login = (token, role, username) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
    setAuth({ token, role, username });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, username: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;