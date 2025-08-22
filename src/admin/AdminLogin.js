// src/pages/AdminPage/AdminLogin.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, auth } from '../context/firebaseFuncs';
import { isSessionValid } from '../context/storageUtils';
import { onAuthStateChanged } from 'firebase/auth';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Thêm useEffect hook này để kiểm tra trạng thái đăng nhập
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && isSessionValid()) {
                // Nếu người dùng đã đăng nhập và phiên còn hợp lệ, chuyển hướng ngay lập tức
                navigate('/admin/dashboard');
            }
        });

        // Cleanup function để hủy đăng ký listener khi component unmount
        return () => unsubscribe();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await loginAdmin(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="admin-login-page">
            <div className="login-container">
                <form onSubmit={handleLogin} className="login-form">
                    <h2>Đăng Nhập Admin</h2>
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group password-container">
                        <label htmlFor="password">Mật khẩu:</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;