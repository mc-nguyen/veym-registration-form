import React, { useState, useRef, useEffect } from "react";
import "./WaiverRelease.css";
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../../context/storageUtils';
import { saveWaiverReleaseToFirebase } from "../../context/firebaseFuncs";
import { useLanguage } from '../../LanguageContext'; // Import useLanguage hook

const WaiverRelease = () => {
    removeFromLocalStorage('tnttRulesFormData');

    if (!getFromLocalStorage('currentPage'))
        window.location.href = '/';
    else if (getFromLocalStorage('currentPage') !== '/waiver-release')
        window.location.href = getFromLocalStorage('currentPage');

    const { translate: t } = useLanguage(); // Lấy hàm translate từ hook

    const [formData, setFormData] = useState(() => {
        const savedData = getFromLocalStorage('waiverFormData') || {
            fullName1: "",
            fullName2: "",
            initial1: "",
            initial2: "",
            initial3: "",
            initial4: "",
            initial5: "",
            initial6: "",
            initial7: "",
            initial8: "",
            initial9: "",
            signature: null,
            printedName: "",
            date: new Date().toLocaleDateString('vi-VN')
        };
        return savedData;
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        saveToLocalStorage('waiverFormData', formData);
        saveWaiverReleaseToFirebase(getFromLocalStorage('id'), formData);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        // Xóa lỗi ngay lập tức khi người dùng bắt đầu nhập
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: null
        }));
    };

    // Signature drawing logic
    const startDrawing = (e) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        const { clientX, clientY } = e.touches ? e.touches[0] : e;
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        ctx.moveTo(x, y);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { clientX, clientY } = e.touches ? e.touches[0] : e;
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineTo(x, y);
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

    const validate = () => {
        let newErrors = {};
        if (!formData.fullName1) newErrors.fullName1 = t('errors.required');
        if (!formData.fullName2) newErrors.fullName2 = t('errors.required');
        if (!formData.initial1) newErrors.initial1 = t('errors.required');
        if (!formData.initial2) newErrors.initial2 = t('errors.required');
        if (!formData.initial3) newErrors.initial3 = t('errors.required');
        if (!formData.initial4) newErrors.initial4 = t('errors.required');
        if (!formData.initial5) newErrors.initial5 = t('errors.required');
        if (!formData.initial6) newErrors.initial6 = t('errors.required');
        if (!formData.initial7) newErrors.initial7 = t('errors.required');
        if (!formData.initial8) newErrors.initial8 = t('errors.required');
        if (!formData.initial9) newErrors.initial9 = t('errors.required');
        if (!formData.signature) newErrors.signature = t('errors.signatureRequired');
        if (!formData.printedName) newErrors.printedName = t('errors.required');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (validate()) {
            saveToLocalStorage('currentPage', '/tntt-rules');
            window.location.href = '/tntt-rules';
        } else {
            alert(t('errors.formErrors'));
            setIsSubmitting(false);
        }
    };

    return (
        <div className="waiver-release-container">
            <h2>{t('waiverRelease.title')}</h2>
            <form onSubmit={handleSubmit}>
                <p className="intro-text">
                    {t('waiverRelease.releaseStatement')}
                </p>
                <p className="instruction-text">
                    {t('waiverRelease.initialInstructions')}
                </p>

                {/* Section 1 */}
                <div className="waiver-section">
                    <p>{t('waiverRelease.sections.section1.text')}</p>
                    <div className={`initial-input-group ${errors.initial1 ? 'error' : ''}`}>
                        <label>{t('waiverRelease.sections.section1.initials')}</label>
                        <input
                            type="text"
                            name="initial1"
                            value={formData.initial1}
                            onChange={handleChange}
                            maxLength="3"
                            required
                        />
                        {errors.initial1 && <span className="error-message">{errors.initial1}</span>}
                    </div>
                </div>

                {/* Section 2 */}
                <div className="waiver-section">
                    <p>{t('waiverRelease.sections.section2.text')}</p>
                    <div className={`initial-input-group ${errors.initial2 ? 'error' : ''}`}>
                        <label>{t('waiverRelease.sections.section2.initials')}</label>
                        <input
                            type="text"
                            name="initial2"
                            value={formData.initial2}
                            onChange={handleChange}
                            maxLength="3"
                            required
                        />
                        {errors.initial2 && <span className="error-message">{errors.initial2}</span>}
                    </div>
                </div>

                {/* Section 3 */}
                <div className="waiver-section">
                    <p>{t('waiverRelease.sections.section3.text')}</p>
                    <div className={`initial-input-group ${errors.initial3 ? 'error' : ''}`}>
                        <label>{t('waiverRelease.sections.section3.initials')}</label>
                        <input
                            type="text"
                            name="initial3"
                            value={formData.initial3}
                            onChange={handleChange}
                            maxLength="3"
                            required
                        />
                        {errors.initial3 && <span className="error-message">{errors.initial3}</span>}
                    </div>
                </div>

                {/* Section 4 */}
                <div className="waiver-section">
                    <p>{t('waiverRelease.sections.section4.text')}</p>
                    <div className={`initial-input-group ${errors.initial4 ? 'error' : ''}`}>
                        <label>{t('waiverRelease.sections.section4.initials')}</label>
                        <input
                            type="text"
                            name="initial4"
                            value={formData.initial4}
                            onChange={handleChange}
                            maxLength="3"
                            required
                        />
                        {errors.initial4 && <span className="error-message">{errors.initial4}</span>}
                    </div>
                </div>

                {/* Section 5 */}
                <div className="waiver-section">
                    <p>{t('waiverRelease.sections.section5.text')}</p>
                    <div className={`initial-input-group ${errors.initial5 ? 'error' : ''}`}>
                        <label>{t('waiverRelease.sections.section5.initials')}</label>
                        <input
                            type="text"
                            name="initial5"
                            value={formData.initial5}
                            onChange={handleChange}
                            maxLength="3"
                            required
                        />
                        {errors.initial5 && <span className="error-message">{errors.initial5}</span>}
                    </div>
                </div>

                {/* Additional initials for WaiverRelease.js */}
                <div className="waiver-section">
                    <div className={`initial-input-group ${errors.initial6 ? 'error' : ''}`}>
                        <label>{t('waiverRelease.sections.section1.initials')}</label> {/* Reusing initial label if no specific content */}
                        <input
                            type="text"
                            name="initial6"
                            value={formData.initial6}
                            onChange={handleChange}
                            maxLength="3"
                            required
                        />
                        {errors.initial6 && <span className="error-message">{errors.initial6}</span>}
                    </div>
                </div>
                <div className="waiver-section">
                    <div className={`initial-input-group ${errors.initial7 ? 'error' : ''}`}>
                        <label>{t('waiverRelease.sections.section1.initials')}</label>
                        <input
                            type="text"
                            name="initial7"
                            value={formData.initial7}
                            onChange={handleChange}
                            maxLength="3"
                            required
                        />
                        {errors.initial7 && <span className="error-message">{errors.initial7}</span>}
                    </div>
                </div>
                <div className="waiver-section">
                    <div className={`initial-input-group ${errors.initial8 ? 'error' : ''}`}>
                        <label>{t('waiverRelease.sections.section1.initials')}</label>
                        <input
                            type="text"
                            name="initial8"
                            value={formData.initial8}
                            onChange={handleChange}
                            maxLength="3"
                            required
                        />
                        {errors.initial8 && <span className="error-message">{errors.initial8}</span>}
                    </div>
                </div>
                <div className="waiver-section">
                    <div className={`initial-input-group ${errors.initial9 ? 'error' : ''}`}>
                        <label>{t('waiverRelease.sections.section1.initials')}</label>
                        <input
                            type="text"
                            name="initial9"
                            value={formData.initial9}
                            onChange={handleChange}
                            maxLength="3"
                            required
                        />
                        {errors.initial9 && <span className="error-message">{errors.initial9}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label>{t('waiverRelease.participantName')}</label>
                    <input
                        type="text"
                        name="fullName1"
                        value={formData.fullName1}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t('waiverRelease.parentGuardianName')}</label>
                    <input
                        type="text"
                        name="fullName2"
                        value={formData.fullName2}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={`form-group signature-group ${errors.signature ? 'error' : ''}`}>
                    <label>{t('waiverRelease.signature')}</label>
                    <div className="signature-container">
                        <canvas
                            ref={canvasRef}
                            className="signature-canvas"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                        <button
                            type="button"
                            className="clear-signature-btn"
                            onClick={clearSignature}
                        >
                            {t('waiverRelease.clearSignature')}
                        </button>
                    </div>
                    {errors.signature && <span className="error-message">{errors.signature}</span>}
                </div>

                <div className="form-group">
                    <label>{t('waiverRelease.printedName')}</label>
                    <input
                        type="text"
                        name="printedName"
                        value={formData.printedName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t('waiverRelease.date')}</label>
                    <input
                        type="text"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        readOnly
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {t('waiverRelease.nextButton')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WaiverRelease;