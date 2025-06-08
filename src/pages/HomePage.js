import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { removeFromLocalStorage, saveToLocalStorage } from '../context/storageUtils';
import { useLanguage } from '../LanguageContext'; // Import useLanguage hook

const HomePage = () => {
    // Xóa dữ liệu cũ khi vào trang chủ để đảm bảo form sạch
    removeFromLocalStorage('registrationFormData');
    removeFromLocalStorage('healthInfoFormData');
    removeFromLocalStorage('waiverFormData');
    removeFromLocalStorage('tnttRulesFormData');
    removeFromLocalStorage('paymentFormData');

    const navigate = useNavigate();
    const { translate: t } = useLanguage(); // Lấy hàm translate từ hook

    return (
        <div className="home-container">
            <div className="content-overlay">
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
    );
};

export default HomePage;