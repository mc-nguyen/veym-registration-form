// src/pages/ProcessingPage/ProcessingPage.js
import React, { useEffect, useState } from 'react'; // Import useState
import './ProcessingPage.css'; // Optional: for custom styling
import { useLanguage } from '../../LanguageContext';
import { getFromLocalStorage } from '../../context/storageUtils';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const ProcessingPage = () => {
    const { translate: t } = useLanguage();
    const navigate = useNavigate(); // Initialize useNavigate hook

    const [showHomeButton, setShowHomeButton] = useState(false); // New state to control button visibility
    
    useEffect(() => {
        // Set a timeout to show the button after 5 seconds
        const timer = setTimeout(() => {
            setShowHomeButton(true);
        }, 5000);

        // Clear the timeout if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    const handleGoHome = () => {
        navigate('/'); // Navigate to the homepage
    };

    return (
        <div className="processing-container">
            <div className="processing-card">
                <h1 className="processing-title">{t('processingPage.title')}</h1>
                <p className="processing-message">{t('processingPage.paymentInstruction')}</p>
                <p className="processing-message">{t('processingPage.saveIDMessage', {id: getFromLocalStorage('id')})}</p>
                <div className="processing-spinner"></div>
                <p className="processing-note">{t('processingPage.afterPaymentNote')}</p>
                <p className="processing-contact">{t('processingPage.contactInfo')}</p>

                {showHomeButton && ( // Conditionally render the button
                    <button onClick={handleGoHome} className="home-button">
                        {t('processingPage.goHomeButton')} {/* Add translation key for the button text */}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProcessingPage;