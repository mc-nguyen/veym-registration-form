import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { removeFromLocalStorage, saveToLocalStorage } from '../context/storageUtils';
// import backgroundImage from './path/to/your/background-image.jpg'; // Thay bằng đường dẫn ảnh của bạn

const HomePage = () => {
    removeFromLocalStorage('registrationFormData')
    removeFromLocalStorage('healthInfoFormData');
    removeFromLocalStorage('waiverFormData');
    removeFromLocalStorage('tnttRulesFormData');
    removeFromLocalStorage('paymentFormData');
    const navigate = useNavigate();

    return (
        // <div className="home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="home-container">
            <div className="content-overlay">
                <h1 className="welcome-title">CHÀO MỪNG ĐẾN VỚI<br/>ĐOÀN THIẾU NHI THÁNH THỂ</h1>
                <p className="welcome-subtitle">Mẹ Thiên Chúa - Giáo xứ Đức Mẹ Hằng Cứu Giúp, Riverside, CA</p>

                <div className="button-container">
                    <button
                        className="start-button"
                        onClick={() => {
                            saveToLocalStorage('currentPage', '/registration')
                            navigate('/registration');
                        }}
                    >
                        BẮT ĐẦU GHI DANH
                    </button>
                    
                    <button
                        className="start-adult-button"
                        onClick={() => {
                            saveToLocalStorage('currentPage', '/registration-adult')
                            navigate('/registration-adult');
                        }}
                    >
                        BẮT ĐẦU GHI DANH (PHIÊN BẢN NGƯỜI LỚN)
                    </button>

                    <button
                        className="guide-button"
                        onClick={() => navigate('/guide')}
                    >
                        HƯỚNG DẪN
                    </button>

                    <button
                        className="preview-button"
                        onClick={() => navigate('/preview-pdf')}
                    >
                        MẪU ĐĂNG KÝ PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;