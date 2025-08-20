import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { removeFromLocalStorage, saveToLocalStorage } from '../context/storageUtils';
import { useLanguage } from '../LanguageContext'; // Import useLanguage hook
// Import logo image
import favicon from '../assets/favicon.png'; // Đường dẫn đến logo của bạn
import { cleanOldUnpaidRegistrations } from '../context/firebaseFuncs'; 

const HomePage = () => {
    // Xóa dữ liệu cũ khi vào trang chủ để đảm bảo form sạch
    removeFromLocalStorage('registrationFormData');
    removeFromLocalStorage('healthInfoFormData');
    removeFromLocalStorage('waiverFormData');
    removeFromLocalStorage('tnttRulesFormData');
    removeFromLocalStorage('paymentFormData');

    const navigate = useNavigate();
    const { translate: t } = useLanguage(); // Lấy hàm translate từ hook
    const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

    useEffect(() => {
        // Gọi hàm dọn dẹp dữ liệu cũ khi component HomePage được mount
        // LƯU Ý QUAN TRỌNG: Việc chạy các thao tác dọn dẹp dữ liệu mạnh mẽ như xóa dữ liệu cũ
        // từ phía client (trình duyệt của người dùng) KHÔNG ĐƯỢC KHUYẾN NGHỊ cho môi trường sản phẩm thực tế
        // do các vấn đề về bảo mật, hiệu suất và độ tin cậy.
        // Giải pháp an toàn và hiệu quả hơn là sử dụng Firebase Cloud Functions (Hàm đám mây Firebase)
        // với các hàm được lập lịch (scheduled functions) để chạy định kỳ trên máy chủ.
        const runCleanup = async () => {
            try {
                console.log("Attempting to clean old registrations from HomePage...");
                await cleanOldUnpaidRegistrations(); // Gọi hàm dọn dẹp
                console.log("Old registrations cleanup initiated successfully from HomePage.");
            } catch (error) {
                console.error("Error during homepage cleanup:", error);
            }
        };

        runCleanup(); // Kích hoạt dọn dẹp khi trang chủ tải
    }, []); // Chạy một lần khi component được mount

    const toggleFloatingMenu = () => {
        setIsFloatingMenuOpen(!isFloatingMenuOpen);
    };

    return (
        <div>
            <div className="home-container">
                <div className="content-overlay">
                    {/* Khu vực logo mới */}
                    <div className="logo-section">
                        <img src={favicon} alt="TNTT Logo" className="home-logo" />
                    </div>

                    {/* Khu vực nội dung văn bản và nút bấm */}
                    <div className="text-content-section">
                        {/* Sử dụng dangerouslySetInnerHTML để render <br/> từ chuỗi dịch */}
                        <h1 className="welcome-title" dangerouslySetInnerHTML={{ __html: t('homePage.welcomeTitle') }}></h1>
                        <p className="welcome-subtitle">{t('homePage.subtitle')}</p>

                        <div className="button-container">
                            <button
                                className="start-button"
                                onClick={() => {
                                    saveToLocalStorage('currentPage', '/registration')
                                    navigate('/registration');
                                }}
                            >
                                {t('homePage.startRegistration')}
                            </button>

                            <button
                                className="start-adult-button"
                                onClick={() => {
                                    saveToLocalStorage('currentPage', '/registration-adult')
                                    navigate('/registration-adult');
                                }}
                            >
                                {t('homePage.startAdultRegistration')}
                            </button>

                            <button
                                className="search-button"
                                onClick={() => {
                                    saveToLocalStorage('currentPage', '/search')
                                    navigate('/search');
                                }}
                            >
                                {t('homePage.search')}
                            </button>

                            <button
                                className="guide-button"
                                onClick={() => navigate('/guide')}
                            >
                                {t('homePage.guide')}
                            </button>

                            <button
                                className="preview-button"
                                onClick={() => navigate('/preview-pdf')}
                            >
                                {t('homePage.previewPdf')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="floating-container">
                {isFloatingMenuOpen && (
                    <div className="floating-options">
                        <button className="floating-option-button" onClick={() => window.location.href='https://veym.net/about/chapters/me-thien-chua-riverside'}>About Us</button>
                        <button className="floating-option-button" onClick={() => navigate('/how-to-pay')}>How to Pay</button>
                    </div>
                )}
                <button className="floating-action-button" onClick={toggleFloatingMenu}>
                    <span className="floating-icon">{isFloatingMenuOpen ? '×' : '+'}</span>
                </button>
            </div>
        </div>
    );
};

export default HomePage;