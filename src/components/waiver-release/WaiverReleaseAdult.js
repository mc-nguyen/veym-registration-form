import React, { useState, useRef, useEffect } from "react";
import "./WaiverRelease.css"; // Dùng chung CSS
import { saveToLocalStorage, getFromLocalStorage } from '../../context/storageUtils';
import { saveWaiverReleaseToFirebase } from "../../context/firebaseFuncs";
import { useLanguage } from '../../LanguageContext'; // Import useLanguage hook

const WaiverReleaseAdult = () => {
    const { translate: t } = useLanguage(); // Lấy hàm translate từ hook

    const [formData, setFormData] = useState(() => {
        const savedData = getFromLocalStorage('waiverFormData') || {
            fullName: getFromLocalStorage('fullName') || "",
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
            printedName: getFromLocalStorage('fullName') || "",
            date: new Date().toLocaleDateString('vi-VN')
        };
        return savedData;
    });

    // State cho validation errors
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
            saveToLocalStorage('currentPage', '/tntt-rules-adult');
            window.location.href = '/tntt-rules-adult';
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

                <div className="waiver-content">
                    <p>
                        {t('waiverRelease.waiver.head1', { fullname: "________" + formData.fullName + "________" })} <br /><br />

                        {t('waiverRelease.waiver.head2')}<br /><br />

                        {t('waiverRelease.waiver.head3', { fullname: "________" + formData.fullName + "________" })} <br />
                    </p>

                    {/* All numbered points with inputs */}

                    <div className="waiver-section">
                        <p>
                            <strong>1.</strong> {t('waiverRelease.waiver.w1')}<br />
                            <InitialInput
                                name="initial1"
                                value={formData.initial1}
                                onChange={handleChange}
                            /> (please initial for concurrence)
                        </p>
                    </div>

                    <div className="waiver-section">
                        <p>
                            <strong>2.</strong> {t('waiverRelease.waiver.w2')}<br />
                            <InitialInput
                                name="initial2"
                                value={formData.initial2}
                                onChange={handleChange}
                            /> (please initial for concurrence)
                        </p>
                    </div>

                    {t('waiverRelease.waiver.head4')}<br />

                    <div className="waiver-section">
                        <p>
                            <strong>3.</strong> {t('waiverRelease.waiver.w3')}<br />
                            <InitialInput
                                name="initial3"
                                value={formData.initial3}
                                onChange={handleChange}
                            /> (please initial for concurrence)
                        </p>
                    </div>

                    <div className="waiver-section">
                        <p>
                            <strong>4.</strong> {t('waiverRelease.waiver.w4')}<br />
                            <InitialInput
                                name="initial4"
                                value={formData.initial4}
                                onChange={handleChange}
                            /> (please initial for concurrence)
                        </p>
                    </div>

                    <div className="waiver-section">
                        <p>
                            <strong>5.</strong> {t('waiverRelease.waiver.w5')}<br />
                            <InitialInput
                                name="initial5"
                                value={formData.initial5}
                                onChange={handleChange}
                            /> (please initial for concurrence)
                        </p>
                    </div>

                    <div className="waiver-section">
                        <p>
                            <strong>6.</strong> {t('waiverRelease.waiver.w6')}<br />
                            <InitialInput
                                name="initial6"
                                value={formData.initial6}
                                onChange={handleChange}
                            /> (please initial for concurrence)
                        </p>
                    </div>

                    <div className="waiver-section">
                        <p>
                            <strong>7.</strong> {t('waiverRelease.waiver.w7')}<br />
                            <InitialInput
                                name="initial7"
                                value={formData.initial7}
                                onChange={handleChange}
                            /> (please initial for concurrence)
                        </p>
                    </div>

                    <div className="waiver-section">
                        <p>
                            <strong>8.</strong> {t('waiverRelease.waiver.w8')}<br />
                            <InitialInput
                                name="initial8"
                                value={formData.initial8}
                                onChange={handleChange}
                            /> (please initial for concurrence)
                        </p>
                    </div>

                    {/* Points 3-8 follow same pattern */}
                    {/* ... */}

                    <div className="waiver-section">
                        <p>
                            ● {t('waiverRelease.waiver.w9')}
                            <InitialInput
                                name="initial9"
                                value={formData.initial9}
                                onChange={handleChange}
                            /> (please initial for concurrence)
                        </p>
                    </div>

                    <div className="waiver-section">
                        <p>
                            ● {t('waiverRelease.waiver.w10')}<br />
                        </p>
                    </div>

                    <div className="waiver-section">
                        <p>
                            ● {t('waiverRelease.waiver.w11')}<br />
                        </p>
                    </div>

                    <div className="waiver-section">
                        <p>
                            ● {t('waiverRelease.waiver.w12')}<br />
                        </p>
                    </div>

                    <div className="signature-section">
                        <p>
                            {t('waiverRelease.waiver.foot')}<br />
                        </p>
                    </div>
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

const InitialInput = ({ name, value, onChange }) => (
    <input
        type="text"
        className="initial-input"
        name={name}
        value={value}
        onChange={onChange}
        maxLength="3"
        required
    />
);

export default WaiverReleaseAdult;