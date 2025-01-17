import React, { createContext, useContext, useState } from 'react'

const AuthContext =  createContext();

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

    const login = (token) => {
        localStorage.setItem('token', token);
        setLoggedIn(true);
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setLoggedIn(false);
    }

    return (
        <AuthContext.Provider value={{loggedIn, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}