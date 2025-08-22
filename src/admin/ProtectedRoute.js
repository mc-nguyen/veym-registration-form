// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../context/firebaseFuncs';
import { isSessionValid } from '../context/storageUtils';
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // Kiểm tra cả trạng thái xác thực của Firebase và phiên đăng nhập
            if (user && isSessionValid()) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                navigate('/admin');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    if (loading) {
        return <div>Đang kiểm tra...</div>;
    }

    return isAuthenticated ? children : null;
};

export default ProtectedRoute;