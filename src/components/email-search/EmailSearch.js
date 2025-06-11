// src/components/EmailSearch.js (hoặc src/App.js)

import React, { useState } from 'react';
import './EmailSearch.css'; // Giữ nguyên file CSS đã tạo trước đó
import { useLanguage } from '../../LanguageContext'; // Import useLanguage hook
import { getDataByEmail } from '../../context/firebaseFuncs';

function EmailSearch() {
    // State để quản lý ngôn ngữ hiện tại, mặc định là 'en'
    // Bạn có thể lấy ngôn ngữ từ localStorage nếu muốn lưu trạng thái
    const { translate: t } = useLanguage(); // Lấy hàm translate từ hook

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success', 'error', 'warning', 'info'

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSearch = async () => {
        if (email.trim() === '') {
            setMessage(t('searchEmail.message_enter_email_or_skip'));
            setMessageType('warning');
        } else if (!isValidEmail(email)) {
            setMessage(t('searchEmail.message_invalid_email'));
            setMessageType('error');
        } else {
            const data = await getDataByEmail(email);
            setMessage(t('searchEmail.message_searching_for_email', { email }));
            const valueArray = Object.values(data).filter(value => typeof value === 'string'); // Lọc bỏ thuộc tính 'length' nếu cần
            console.log(valueArray);
            setMessageType('success');
        }
    };

    const handleSkip = () => {
        setMessage(t('searchEmail.message_skipped'));
        setMessageType('info');
        setEmail('');
        setTimeout(() => {
            // window.location.href = '/next-page';
            console.log('Chuyển hướng đến trang tiếp theo.');
            setMessage('');
        }, 1500);
    };

    return (
        <div className="container">
            <h1>{t('searchEmail.search_data_title')}</h1>
            <p>{t('searchEmail.search_data_description')}</p>
            <input
                type="email"
                id="emailInput"
                placeholder={t('searchEmail.enter_email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div className="button-group">
                <button onClick={handleSearch} className="search-button">{t('searchEmail.search_button')}</button>
                <button onClick={handleSkip} className="skip-button">{t('searchEmail.skip_button')}</button>
            </div>
            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default EmailSearch;