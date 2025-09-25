import { Navigate } from "react-router-dom";

export const ProtectedRoutes= ({children}) => {
    const token = sessionStorage.getItem('token');

    if(!token) {
        alert("login first")
        return <Navigate to='/signin' replace />
    } 
    return children;
}