import { useContext, createContext, useState, useEffect } from "react"
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext()

export const AuthProvider = ({ children })=> {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodeUser = jwtDecode(token);
                setUser(decodeUser)
            } catch (error) {
                console.error("Failed to decode token:", error);
            }
        }
        setLoading(false);
    }, []);

    const login = (userData)=> setUser(userData)
    const logout = ()=> setUser(null)

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    return useContext(AuthContext)
}


