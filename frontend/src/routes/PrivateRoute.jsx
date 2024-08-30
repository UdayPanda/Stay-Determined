import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ element }) => {
    const { user, loading } = useAuth()
    const location = useLocation()

    if(loading) return <h1>Loading...</h1>

    if(!user) {
        return <Navigate to='/login' state={{ form : location }} replace />
    }

    return element

}

export default PrivateRoute