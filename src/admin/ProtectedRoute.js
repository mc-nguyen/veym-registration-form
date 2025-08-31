// src/components/ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore'; // Import onSnapshot
import { auth, db } from '../context/firebaseFuncs'; // Thêm db
import { useAuthState } from 'react-firebase-hooks/auth';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const [user, loadingUser] = useAuthState(auth);

    // State riêng để lắng nghe chế độ bảo trì
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [loadingMaintenance, setLoadingMaintenance] = useState(true);

    // Lắng nghe trạng thái bảo trì từ Firestore theo thời gian thực
    useEffect(() => {
        const settingsRef = doc(db, 'settings', 'app_settings');
        const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setIsMaintenanceMode(data.isMaintenanceMode || false);
                setLoadingMaintenance(false);
            } else {
                setLoadingMaintenance(false);
            }
        }, (err) => {
            console.error("Lỗi khi lắng nghe cài đặt:", err);
            setLoadingMaintenance(false);
        });
        return () => unsubscribe();
    }, []);

    // Hiển thị màn hình loading trong khi đang kiểm tra
    if (loadingUser || loadingMaintenance) {
        return <div>Đang kiểm tra trạng thái...</div>;
    }

    // Logic chính để điều hướng
    // 1. Nếu chế độ bảo trì đang bật VÀ đường dẫn KHÔNG phải là trang admin
    if (isMaintenanceMode && !location.pathname.startsWith('/admin')) {
        return <Navigate to="/maintenance" replace />;
    }

    // 2. Nếu đường dẫn là trang admin VÀ người dùng CHƯA đăng nhập
    if (location.pathname.startsWith('/admin') && !user) {
        return <Navigate to="/admin" replace />;
    }

    // 3. Nếu các điều kiện trên không xảy ra, cho phép truy cập
    return children;
};

export default ProtectedRoute;