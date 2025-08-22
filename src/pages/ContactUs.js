// src/pages/ContactUs/ContactUs.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { saveContactMessageToFirebase } from '../context/firebaseFuncs'; // Import hàm mới
import './ContactUs.css';

const ContactUs = () => {
    const { translate: t } = useLanguage();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await saveContactMessageToFirebase(formData); // Gọi hàm lưu vào Firestore
            setSubmitted(true);
            setLoading(false);

            // Giả lập reset form sau khi gửi
            setTimeout(() => {
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
                setSubmitted(false);
            }, 3000);
        } catch (err) {
            console.error("Error submitting contact form:", err);
            setError('Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại.');
            setLoading(false);
        }
    };

    return (
        <div className="contact-us-page">
            <div className="contact-container">
                <h1>{t('contactUs.title')}</h1>
                <p>{t('contactUs.intro')}</p>
                <div className="contact-info">
                    <h2>{t('contactUs.contactInfoTitle')}</h2>
                    <p><strong>{t('contactUs.email')}:</strong> <a href="mailto:tnttmethienchuariverside@gmail.com">tnttmethienchuariverside@gmail.com</a></p>
                    <p><strong>{t('contactUs.phone')}:</strong> (909) 543-5559</p>
                    <p><strong>{t('contactUs.address')}:</strong> 5250 Central Ave, Riverside, CA 92504</p>
                </div>
                
                <form onSubmit={handleSubmit} className="contact-form">
                    <h2>{t('contactUs.formTitle')}</h2>
                    {submitted && (
                        <p className="success-message">
                            {t('contactUs.successMessage')}
                        </p>
                    )}
                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}
                    <div className="form-group">
                        <label htmlFor="name">{t('contactUs.formName')}</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">{t('contactUs.formEmail')}</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="subject">{t('contactUs.formSubject')}</label>
                        <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">{t('contactUs.formMessage')}</label>
                        <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="5" required></textarea>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang gửi...' : t('contactUs.formButton')}
                    </button>
                </form>

                <button className="back-button" onClick={() => navigate('/')}>
                    {t('contactUs.backButton')}
                </button>
            </div>
        </div>
    );
};

export default ContactUs;