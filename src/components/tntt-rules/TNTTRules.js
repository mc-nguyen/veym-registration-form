// TNTTRules.js
import React, { useState, useEffect } from 'react';
import './TNTTRules.css';
import { saveToLocalStorage, getFromLocalStorage } from '../../context/storageUtils';
import { saveTNTTRulesToFirebase } from '../../context/firebaseFuncs';
import { useLanguage } from '../../LanguageContext';
import SignatureCanvas from '../signature/SignatureCanvas'; // Import SignatureCanvas

const TNTTRules = () => {
    const { translate: t } = useLanguage();

    const [formData, setFormData] = useState(() => {
        const savedData = getFromLocalStorage('tnttRulesFormData') || {
            memberName: getFromLocalStorage('fullName') || "",
            date: new Date().toLocaleDateString('vi-VN'),
            nganh: getFromLocalStorage('nganh') || "",
            signature: null, // Sẽ được quản lý bởi SignatureCanvas
            agreed: false
        };
        return savedData;
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State mới cho chữ ký và trạng thái vẽ
    const [signatureData, setSignatureData] = useState(null);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [isMobile, setIsMobile] = useState(false); // Để điều chỉnh kích thước canvas

    useEffect(() => {
        // Kiểm tra kích thước màn hình để điều chỉnh canvas
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Callback khi chữ ký được lưu
    const handleSignatureSave = (dataUrl) => {
        setSignatureData(dataUrl);
        setHasDrawn(dataUrl !== null);
        setFormData(prev => ({ ...prev, signature: dataUrl }));
    };

    // Callback khi chữ ký được xóa
    const handleSignatureClear = () => {
        setSignatureData(null);
        setHasDrawn(false);
        setFormData(prev => ({ ...prev, signature: null }));
    };

    useEffect(() => {
        saveToLocalStorage('tnttRulesFormData', formData);
        // saveTNTTRulesToFirebase(getFromLocalStorage('id'), formData); // Chỉ lưu khi submit
    }, [formData]);

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
        if (errors.agreed) {
            setErrors(prev => ({ ...prev, agreed: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.agreed) {
            newErrors.agreed = t('tnttRules.agreementRequired');
        }
        if (!hasDrawn) {
            newErrors.signature = t('tnttRules.signatureRequired');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert(t('tnttRules.pleaseAgreeAndSign'));
            return;
        }

        setIsSubmitting(true);
        try {
            const finalFormData = { ...formData, signature: signatureData };
            await saveTNTTRulesToFirebase(getFromLocalStorage('id'), finalFormData);
            saveToLocalStorage('currentPage', '/parent-survey');
            window.location.href = '/parent-survey';
        } catch (error) {
            console.error("Error submitting rules:", error);
            alert(t('tnttRules.submissionError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="tntt-rules-container">
            <h2 className="tntt-rules-title">{t('tnttRules.title')}</h2>
            <div className="tntt-rules-content">
                <ol>
                    <li>{t('tnttRules.rules.rule1')}</li>
                    <li>{t('tnttRules.rules.rule2')}</li>
                    <li>{t('tnttRules.rules.rule3')}</li>
                    <li>{t('tnttRules.rules.rule4')}</li>
                    <li>{t('tnttRules.rules.rule5')}</li>
                    <li>{t('tnttRules.rules.rule6')}</li>
                    <li>{t('tnttRules.rules.rule7')}</li>
                    <li>{t('tnttRules.rules.rule8')}</li>
                    <li>{t('tnttRules.rules.rule9')}</li>
                    <li>{t('tnttRules.rules.rule10')}</li>
                </ol>
                <p style={{ textDecorationLine: 'underline' }}>{t('tnttRules.rules.consequences')}</p>
                <ol>
                    <li>{t('tnttRules.rules.consequence1')}</li>
                    <li>{t('tnttRules.rules.consequence2')}</li>
                    <li>{t('tnttRules.rules.consequence3')}</li>
                </ol>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>{t('tnttRules.memberName')}</label>
                    <input
                        type="text"
                        name="memberName"
                        value={formData.memberName}
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label>{t('tnttRules.date')}</label>
                    <input
                        type="text"
                        name="date"
                        value={formData.date}
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label>{t('tnttRules.nganh')}</label>
                    <input
                        type="text"
                        name="nganh"
                        value={formData.nganh}
                        readOnly
                    />
                </div>

                <div className="form-group agreement-checkbox">
                    <input
                        type="checkbox"
                        id="agreed"
                        name="agreed"
                        checked={formData.agreed}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="agreed">{t('tnttRules.acknowledgment')}</label>
                    {errors.agreed && <span className="error-message">{errors.agreed}</span>}
                </div>

                <div className={`form-group signature-area ${errors.signature ? 'error' : ''}`}> {/* Sử dụng class signature-area chung */}
                    <label>{t('tnttRules.signature')}</label>
                    <SignatureCanvas
                        onSave={handleSignatureSave}
                        onClear={handleSignatureClear}
                        width={isMobile ? 300 : 400}
                        height={150}
                    />
                    {errors.signature && <span className="error-message">{errors.signature}</span>}
                </div>

                <div className="form-note">
                    <p>{t('tnttRules.note')}</p>
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {t('tnttRules.submitButton')}
                </button>
            </form>
        </div>
    );
};

export default TNTTRules;