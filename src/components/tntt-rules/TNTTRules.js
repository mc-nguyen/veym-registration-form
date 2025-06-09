import React, { useState, useRef, useEffect } from 'react';
import './TNTTRules.css';
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../../context/storageUtils';
import { saveTNTTRulesToFirebase } from '../../context/firebaseFuncs';
import { useLanguage } from '../../LanguageContext'; // Import useLanguage hook

const TNTTRules = () => {
    if (!getFromLocalStorage('currentPage'))
        window.location.href = '/';
    else if (getFromLocalStorage('currentPage') !== '/tntt-rules')
        window.location.href = getFromLocalStorage('currentPage');

    const { translate: t } = useLanguage(); // Lấy hàm translate từ hook

    const [formData, setFormData] = useState(() => {
        const savedData = getFromLocalStorage('tnttRulesFormData') || {
            memberName: '',
            date: new Date().toLocaleDateString('vi-VN'),
            nganh: '',
            signature: null,
            agreed: false
        };
        return savedData;
    });

    const [errors, setErrors] = useState({});
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        saveToLocalStorage('tnttRulesFormData', formData);
        saveTNTTRulesToFirebase(getFromLocalStorage('id'), formData);
    }, [formData]);

    // Signature handling
    const startDrawing = (e) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        const { clientX, clientY } = e.touches ? e.touches[0] : e;
        const rect = canvas.getBoundingClientRect();

        ctx.moveTo(clientX - rect.left, clientY - rect.top);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { clientX, clientY } = e.touches ? e.touches[0] : e;
        const rect = canvas.getBoundingClientRect();

        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (canvas) {
            setFormData(prevData => ({
                ...prevData,
                signature: canvas.toDataURL()
            }));
        }
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setFormData(prevData => ({
            ...prevData,
            signature: null
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.memberName) newErrors.memberName = t('errors.required');
        if (!formData.nganh) newErrors.nganh = t('errors.required');
        if (!formData.signature) newErrors.signature = t('errors.signatureRequired');
        if (!formData.agreed) newErrors.agreed = t('errors.agreementRequired');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Proceed to next page or confirm
            saveToLocalStorage('currentPage', '/confirmation'); // Assuming next page is /confirmation
            window.location.href = '/confirmation';
        } else {
            alert(t('errors.formErrors'));
        }
    };

    return (
        <div className="tntt-rules-container">
            <h2>{t('tnttRules.title')}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>{t('tnttRules.memberName')}</label>
                    <input
                        type="text"
                        name="memberName"
                        value={formData.memberName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>{t('tnttRules.date')}</label>
                    <input
                        type="text"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>{t('tnttRules.branch')}</label>
                    <input
                        type="text"
                        name="nganh"
                        value={formData.nganh}
                        onChange={handleChange}
                        required
                    />
                </div>

                <p className="rules-intro">
                    {t('tnttRules.rulesIntro')}
                </p>

                <ol className="rules-list">
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
                    <li>{t('tnttRules.rules.rule11')}</li>
                    <li>{t('tnttRules.rules.rule12')}</li>
                    <li>{t('tnttRules.rules.rule13')}</li>
                </ol>

                <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="agreed"
                            checked={formData.agreed}
                            onChange={handleChange}
                            required
                        />
                        {t('tnttRules.acknowledgment')}
                    </label>
                    {errors.agreed && <span className="error-message">{errors.agreed}</span>}
                </div>

                <div className={`form-group signature-group ${errors.signature ? 'error' : ''}`}>
                    <label>{t('tnttRules.signature')}</label>
                    <div className="signature-container">
                        <canvas
                            ref={canvasRef}
                            width={400}
                            height={150}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                        <button type="button" onClick={clearSignature} className="clear-btn">
                            {t('tnttRules.clearSignature')}
                        </button>
                    </div>
                    {errors.signature && <span className="error-message">{errors.signature}</span>}
                </div>

                <div className="form-note">
                    <p>{t('tnttRules.note')}</p>
                </div>

                <button type="submit" className="submit-btn">
                    {t('tnttRules.submitButton')}
                </button>
            </form>
        </div>
    );
};

export default TNTTRules;