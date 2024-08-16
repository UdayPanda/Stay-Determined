import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ element }) => {
    const { user } = useAuth()
    const location = useLocation()

    if(!user) {
        return <Navigate to='/login' state={{ form : location }} replace />
    }

    return element

}

export default PrivateRoute