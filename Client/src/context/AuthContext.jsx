import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

    const backendUrl = import.meta.env.BackendURL || 'http://localhost:5000' || "https://hospital-management-system-tau-tawny-53.vercel.app/"; 
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const value = {
        user, setUser,
        token, setToken,
        backendUrl,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;