import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GuidePage.css';

const GuidePage = () => {
    const navigate = useNavigate();

    return (
        <div className="guide-container">
            <h1>HƯỚNG DẪN ĐĂNG KÝ</h1>

            <div className="guide-content">
                <h2>Các bước đăng ký:</h2>
                <ol>
                    <li>Nhấn nút "BẮT ĐẦU ĐĂNG KÍ"</li>
                    <li>Điền đầy đủ thông tin cá nhân</li>
                    <li>Thanh toán phí sinh hoạt</li>
                    <li>Điền thông tin sức khỏe</li>
                    <li>Xem và đồng ý với các điều khoản</li>
                    <li>Hoàn tất đăng ký</li>
                </ol>

                <h2>Lưu ý quan trọng:</h2>
                <ul>
                    <li>Chuẩn bị sẵn thông tin cá nhân và thông tin bảo hiểm</li>
                    <li>Quá trình đăng ký mất khoảng 10-15 phút</li>
                    <li>Cần có chữ ký của phụ huynh nếu học sinh dưới 18 tuổi</li>
                </ul>
            </div>

            <button
                className="back-button"
                onClick={() => navigate('/')}
            >
                QUAY LẠI TRANG CHỦ
            </button>
        </div>
    );
};

export default GuidePage;