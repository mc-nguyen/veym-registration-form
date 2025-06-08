import React, { createContext, useState, useContext, useEffect } from 'react';

// Import all translation files
import enTranslations from './locales/en/registration.json';
import viTranslations from './locales/vi/registration.json';

const translations = {
    en: enTranslations,
    vi: viTranslations,
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Lấy ngôn ngữ từ localStorage hoặc mặc định là 'vi'
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('appLanguage') || 'vi';
    });

    // Lưu ngôn ngữ vào localStorage mỗi khi nó thay đổi
    useEffect(() => {
        localStorage.setItem('appLanguage', language);
    }, [language]);

    // Hàm dịch thuật
    const translate = (key, options = {}) => {
        const keys = key.split('.');
        let text = translations[language];

        for (let i = 0; i < keys.length; i++) {
            if (text && typeof text === 'object' && keys[i] in text) {
                text = text[keys[i]];
            } else {
                // Fallback to English if translation key not found in current language
                let fallbackText = translations['en'];
                for (let j = 0; j < keys.length; j++) {
                    if (fallbackText && typeof fallbackText === 'object' && keys[j] in fallbackText) {
                        fallbackText = fallbackText[keys[j]];
                    } else {
                        return key; // Return the key itself if no translation found
                    }
                }
                return replacePlaceholders(fallbackText, options);
            }
        }

        // Replace placeholders like {{name}} with actual values
        return replacePlaceholders(text, options);
    };

    const replacePlaceholders = (text, options) => {
        if (typeof text !== 'string') return text; // Return as is if not a string
        let result = text;
        for (const key in options) {
            result = result.replace(new RegExp(`{{${key}}}`, 'g'), options[key]);
        }
        return result;
    };

    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
    };

    return (
        <LanguageContext.Provider value={{ language, translate, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook để sử dụng trong các component
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};