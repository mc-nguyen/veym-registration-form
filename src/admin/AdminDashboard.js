// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, getDataById } from '../context/firebaseFuncs'; // Đảm bảo đường dẫn đúng
import { saveToLocalStorage } from '../context/storageUtils';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState('');
    const [fetchedData, setFetchedData] = useState(null);
    const [searchError, setSearchError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Kiểm tra role của người dùng trong Firestore
                saveToLocalStorage('user', currentUser);
                try {
                    if (currentUser) {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                        navigate('/admin/login'); // Chuyển hướng nếu không phải admin
                    }
                } catch (error) {
                    console.error("Lỗi khi kiểm tra quyền Admin:", error);
                    setIsAdmin(false);
                    navigate('/admin/login');
                }
            } else {
                setUser(null);
                setIsAdmin(false);
                navigate('/admin/login'); // Chuyển hướng nếu chưa đăng nhập
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setFetchedData(null);
        setSearchError('');
        if (!searchId) {
            setSearchError('Vui lòng nhập ID tài liệu.');
            return;
        }
        try {
            // Sử dụng hàm getDataById bạn đã tạo trước đó
            const data = await getDataById(searchId);
            if (data) {
                setFetchedData(data);
            } else {
                setSearchError('Không tìm thấy dữ liệu cho ID này.');
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm dữ liệu:", error);
            setSearchError('Đã xảy ra lỗi khi tìm kiếm dữ liệu.');
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin/login');
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
    };

    if (loading) {
        return <p>Đang kiểm tra quyền truy cập...</p>;
    }

    if (!isAdmin) {
        return null; // Hoặc hiển thị thông báo "Không có quyền truy cập"
    }

    return (
        <div className="admin-dashboard-container">
            <h2>Chào mừng, Admin {user}!</h2>
            <button onClick={handleLogout} style={{ float: 'right' }}>Đăng xuất</button>

            <h3>Tìm kiếm thông tin đăng ký theo ID</h3>
            <form onSubmit={handleSearch}>
                <div>
                    <label htmlFor="searchId">Nhập ID đăng ký:</label>
                    <input
                        type="text"
                        id="searchId"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Ví dụ: aBcXyZ123"
                        required
                    />
                </div>
                <button type="submit">Tìm kiếm</button>
                {searchError && <p className="error-message">{searchError}</p>}
            </form>

            {fetchedData && (
                <div className="fetched-data-display">
                    <p><strong>Mã xác nhận:</strong> {fetchedData.confirmationCode || 'N/A'}</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;