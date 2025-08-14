// import { useContext, createContext, useState, useEffect } from "react"
// import { apiClient } from "../lib/apiClient"

// const AuthContext = createContext()

// export const AuthProvider = ({ children })=> {
//     const [user, setUser] = useState(null)
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         const fetchUser = async () => {
//             const token = localStorage.getItem("token");
//         if (token) {
//             try {
//                 const response = await apiClient.post("api/auth/decode", { token }, { headers: { 'Content-Type': 'application/json' } })
//                 setUser(response.data.user)
//             } catch (error) {
//                 console.error("Failed to decode token:", error);
//             }
//         }
//         }

//         fetchUser();
//         setLoading(false);
//     }, []);

//     const login = (userData)=> setUser(userData)
//     const logout = ()=> setUser(null)

//     return (
//         <AuthContext.Provider value={{ user, login, logout, loading }}>
//             { children }
//         </AuthContext.Provider>
//     )
// }

// export const useAuth = ()=>{
//     return useContext(AuthContext)
// }


import { useContext, createContext, useState, useEffect } from "react";
import { apiClient } from "../lib/apiClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true); 
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    const response = await apiClient.post(
                        "api/auth/decode",
                        { token },
                        { headers: { "Content-Type": "application/json" } }
                    );
                    setUser(response.data.user || null);
                } catch (error) {
                    console.error("Failed to decode token:", error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }

            setLoading(false); 
        };

        fetchUser();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
