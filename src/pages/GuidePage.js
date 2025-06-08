import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GuidePage.css';
import { useLanguage } from '../LanguageContext'; // Import useLanguage hook

const GuidePage = () => {
    const navigate = useNavigate();
    const { translate: t } = useLanguage(); // Lấy hàm translate từ hook

    return (
        <div className="guide-container">
            <h1>{t('guidePage.title')}</h1>

            <div className="guide-content">
                <h2>{t('guidePage.stepsTitle')}</h2>
                <ol>
                    <li>{t('guidePage.step1')}</li>
                    <li>{t('guidePage.step2')}</li>
                    <li>{t('guidePage.step3')}</li>
                    <li>{t('guidePage.step4')}</li>
                    <li>{t('guidePage.step5')}</li>
                    <li>{t('guidePage.step6')}</li>
                </ol>

                <h2>{t('guidePage.noteTitle')}</h2>
                <ul>
                    <li>{t('guidePage.note1')}</li>
                    <li>{t('guidePage.note2')}</li>
                    <li>{t('guidePage.note3')}</li>
                </ul>
            </div>

            <button
                className="back-button"
                onClick={() => navigate('/')}
            >
                {t('guidePage.backToHome')}
            </button>
        </div>
    );
};

export default GuidePage;