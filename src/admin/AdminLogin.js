// src/components/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../context/firebaseFuncs'; // Đảm bảo đường dẫn đúng
import { saveToLocalStorage } from '../context/storageUtils';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset lỗi
        try {
            // Đăng nhập bằng Firebase Authentication
            await signInWithEmailAndPassword(auth, email, password);
            saveToLocalStorage("error", "None");
            // Nếu đăng nhập thành công, chuyển hướng đến trang Admin Dashboard
            navigate('/admin/dashboard');
        } catch (err) {
            // Xử lý lỗi đăng nhập
            console.error("Lỗi đăng nhập:", err.code, err.message);
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    setError('Email hoặc mật khẩu không đúng.');
                    break;
                case 'auth/invalid-email':
                    setError('Email không hợp lệ.');
                    break;
                default:
                    setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="admin-login-container">
            <h2>Đăng nhập Admin</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Mật khẩu:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Đăng nhập</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default AdminLogin;