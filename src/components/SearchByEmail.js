// src/pages/AdminPage/SearchByEmail.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDataById } from '../context/firebaseFuncs';
import './SearchByEmail.css'; // Tạo file CSS này để định dạng
import { saveToLocalStorage } from '../context/storageUtils';

const SearchByEmail = () => {
    const [id, setId] = useState(''); // Đổi state từ email sang id
    const [foundUser, setFoundUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFoundUser(null);
        
        try {
            // Sử dụng hàm getDataById để tìm kiếm trực tiếp bằng ID
            const result = await getDataById(id);
            if (result && result.registration) {
                // Lấy dữ liệu người dùng từ sub-field 'registration'
                setFoundUser({ id, ...result });
            } else {
                setError('Không tìm thấy người đăng ký nào với ID này.');
            }
        } catch (err) {
            console.error("Lỗi khi tìm kiếm:", err);
            setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (id) => {
        // Điều hướng đến trang chỉnh sửa, truyền ID vào URL
        saveToLocalStorage('id', id);
        saveToLocalStorage('registrationFormData', foundUser.registration);
        saveToLocalStorage('healthInfoFormData', foundUser.healthInfo);
        saveToLocalStorage('waiverFormData', foundUser.waiverRelease);
        saveToLocalStorage('tnttRulesFormData', foundUser.tnttRules);
        saveToLocalStorage('paymentFormData', foundUser.payment);
        saveToLocalStorage('complete', foundUser.isPaid)

        const allowedNganh = ["Hiệp Sĩ Trưởng Thành", "Huynh Trưởng", "Trợ Tá", "Huấn Luyện Viên"];

        if (allowedNganh.includes(foundUser.registration.nganh)) navigate('/registration-adult');
        else navigate('/registration');
        
    };

    return (
        <div className="search-container">
            <h1>Tìm Kiếm Người Đăng Ký</h1>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text" // Đổi type sang text
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Nhập ID cần tìm..." // Đổi placeholder
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {foundUser && (
                <div className="user-details-card">
                    <h2>Thông tin người dùng</h2>
                    <p><strong>Họ tên:</strong> {[foundUser.registration.ho, foundUser.registration.tenDem, foundUser.registration.tenGoi].filter(Boolean).join(' ').trim()}</p>
                    <p><strong>Ngày sinh:</strong> {foundUser.registration.ngaySinh || 'N/A'}</p>
                    <p><strong>Ngành:</strong> {foundUser.registration.nganh || 'N/A'}</p>
                    <p><strong>Số điện thoại:</strong> {foundUser.registration.phoneCell || 'N/A'}</p>
                    <p><strong>Email:</strong> {foundUser.registration.email || 'N/A'}</p>
                    <button 
                        onClick={() => handleEditClick(foundUser.id)}
                        className="edit-button"
                    >
                        Sửa Đổi
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchByEmail;