// WaiverRelease.js
import React, { useState, useEffect } from "react";
import "./WaiverRelease.css"; // Dùng chung CSS
import { saveToLocalStorage, getFromLocalStorage } from '../../context/storageUtils';
import { saveWaiverReleaseToFirebase } from "../../context/firebaseFuncs";
import { useLanguage } from '../../LanguageContext';
import SignatureCanvas from '../signature/SignatureCanvas'; // Import SignatureCanvas

const WaiverRelease = () => {
    const { translate: t } = useLanguage();

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
            signature: null, // Sẽ được quản lý bởi SignatureCanvas
            printedName: "",
            date: new Date().toLocaleDateString('vi-VN')
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
        setHasDrawn(dataUrl !== null); // Đặt true nếu có data, false nếu null
        setFormData(prev => ({ ...prev, signature: dataUrl })); // Cập nhật formData
    };

    // Callback khi chữ ký được xóa
    const handleSignatureClear = () => {
        setSignatureData(null);
        setHasDrawn(false);
        setFormData(prev => ({ ...prev, signature: null })); // Cập nhật formData
    };

    useEffect(() => {
        saveToLocalStorage('waiverFormData', formData);
        // Lưu lên Firebase ngay khi formData thay đổi (bao gồm cả chữ ký)
        // saveWaiverReleaseToFirebase(getFromLocalStorage('id'), formData); // Chỉ nên gọi khi submit form cuối cùng
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Xóa lỗi nếu trường được điền
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!hasDrawn) { // Kiểm tra xem đã ký chưa
            newErrors.signature = t('waiverRelease.signatureRequired');
        }
        if (!formData.printedName) {
            newErrors.printedName = t('waiverRelease.printedNameRequired');
        }
        // Thêm các kiểm tra khác cho initial inputs nếu cần
        for (let i = 1; i <= 9; i++) {
            if (!formData[`initial${i}`]) {
                newErrors[`initial${i}`] = t('waiverRelease.initialRequired');
                // break; // Có thể dừng lại ở lỗi đầu tiên hoặc thu thập tất cả
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            alert(t('waiverRelease.pleaseFillAllFieldsAndSign')); // Thông báo chung cho lỗi
            return;
        }

        setIsSubmitting(true);
        try {
            // Đảm bảo signatureData đã được cập nhật vào formData
            const finalFormData = { ...formData, signature: signatureData };
            await saveWaiverReleaseToFirebase(getFromLocalStorage('id'), finalFormData);
            saveToLocalStorage('currentPage', '/tntt-rules');
            window.location.href = '/tntt-rules';
        } catch (error) {
            console.error("Error submitting waiver:", error);
            alert(t('waiverRelease.submissionError'));
        } finally {
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
                        <div style={{ border: "solid 1px black", margin: "10px 0 10px", padding: "10px 10px 0" }}>
                            <label>{t('waiverRelease.fullnameRequest')}</label>
                            <InlineInput
                                name="fullName1"
                                value={formData.fullName1}
                                onChange={handleChange}
                                width={500}
                            /><br /><br />
                        </div>

                        {t('waiverRelease.waiver.head1', { fullname: "________" + formData.fullName1 + "________" })} <br /><br />

                        {t('waiverRelease.waiver.head2')}<br /><br />

                        <div style={{ border: "solid 1px black", margin: "10px 0 10px", padding: "10px 10px 0" }}>
                            <label>{t('waiverRelease.fullnameRequest')}</label>
                            <InlineInput
                                name="fullName2"
                                value={formData.fullName2}
                                onChange={handleChange}
                                width={500}
                            /><br /><br />
                        </div>

                        {t('waiverRelease.waiver.head3', { fullname: "________" + formData.fullName2 + "________" })} <br />
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
                            <div dangerouslySetInnerHTML={{ __html: t('waiverRelease.waiver.w7') }}></div><br />
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
                        <p dangerouslySetInnerHTML={{ __html: t('waiverRelease.waiver.w10') }}></p>
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
                        <strong>
                            {t('waiverRelease.waiver.foot')}<br />
                        </strong>
                    </div>
                </div>

                <div className="form-group signature-area"> {/* Sử dụng class signature-area chung */}
                    <label>{t('waiverRelease.signature')}</label>
                    <SignatureCanvas
                        onSave={handleSignatureSave}
                        onClear={handleSignatureClear}
                        width={isMobile ? 300 : 400} // Điều chỉnh width theo yêu cầu
                        height={150}
                    />
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
                    {errors.printedName && <span className="error-message">{errors.printedName}</span>}
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

// Custom Components for consistent styling
const InlineInput = ({ name, value, onChange, width }) => (
    <input
        type="text"
        className="inline-input"
        name={name}
        value={value}
        onChange={onChange}
        style={{ width }}
        required
    />
);

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

export default WaiverRelease;