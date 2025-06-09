// RegistrationForm.js
import React, { useState, useRef, useEffect } from "react";
import "./RegistrationForm.css";
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../../context/storageUtils';
import { saveRegistrationToFirebase } from "../../context/firebaseFuncs";
import { useLanguage } from '../../LanguageContext'; // Import useLanguage hook

const RegistrationForm = () => {
    removeFromLocalStorage('healthInfoFormData');
    removeFromLocalStorage('waiverFormData');
    removeFromLocalStorage('tnttRulesFormData');
    removeFromLocalStorage('paymentFormData');

    if (!getFromLocalStorage('currentPage'))
        window.location.href = '/';
    else if (getFromLocalStorage('currentPage') !== '/registration')
        window.location.href = getFromLocalStorage('currentPage');

    const { translate: t } = useLanguage(); // Lấy hàm translate từ hook

    const [formData, setFormData] = useState(() => {
        const savedData = getFromLocalStorage('registrationFormData') || {
            tenThanh: "",
            ho: "",
            tenDem: "",
            tenGoi: "",
            tenCha: "",
            tenMe: "",
            diaChi: "",
            phoneHome: "",
            phoneCell: "",
            phoneWork: "",
            phoneEmergency: "",
            email: "",
            ngaySinh: "",
            nganh: "" // Sẽ lưu KEY của ngành vào đây
        };
        return savedData;
    });

    const [nganhHienThiKey, setNganhHienThiKey] = useState(""); // State để lưu KEY của ngành hiển thị
    const [isMobile, setIsMobile] = useState(false);
    const parentCanvasRef = useRef(null);
    const [isParentDrawing, setIsParentDrawing] = useState(false);
    const [parentSignatureData, setParentSignatureData] = useState(null);

    // Hàm để tính toán KEY ngành dựa trên năm sinh
    const calculateNganhKey = (birthDateString) => {
        if (!birthDateString) return "";

        const birthYear = new Date(birthDateString).getFullYear();

        switch (birthYear) {
            case 2019: return "AU_NHI_DU_BI";
            case 2018: return "AU_NHI_CAP_1";
            case 2017: return "AU_NHI_CAP_2";
            case 2016: return "AU_NHI_CAP_3"; // Giả định cấp Thiếu Nhi
            case 2015: return "THIEU_NHI_CAP_1";
            case 2014: return "THIEU_NHI_CAP_2";
            case 2013: return "THIEU_NHI_CAP_3"; // Giả định cấp Nghĩa Sĩ
            case 2012: return "NGHIA_SI_CAP_1";
            case 2011: return "NGHIA_SI_CAP_2";
            case 2010: return "NGHIA_SI_CAP_3"; // Giả định cấp Hiệp Sĩ
            case 2009: return "HIEP_SI_CAP_1";
            case 2008: return "HIEP_SI_CAP_2";
            default: return "INVALID_BRANCH"; // Mặc định là "Không hợp lệ"
        }
    };

    useEffect(() => {
        saveToLocalStorage('registrationFormData', formData);
        const calculatedNganhKey = calculateNganhKey(formData.ngaySinh);
        setNganhHienThiKey(calculatedNganhKey);
        // Lưu KEY của ngành vào formData để gửi lên Firebase
        setFormData(prevData => ({ ...prevData, nganh: calculatedNganhKey }));

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [formData, t]); // Thêm 't' vào dependency array để re-render khi ngôn ngữ thay đổi

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // --- Logic vẽ chữ ký (giữ nguyên) ---
    const startParentDrawing = (e) => {
        e.preventDefault();
        const canvas = parentCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
        setIsParentDrawing(true);
    };

    const drawParent = (e) => {
        e.preventDefault();
        if (!isParentDrawing) return;
        const canvas = parentCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
    };

    const endParentDrawing = () => {
        setIsParentDrawing(false);
        const canvas = parentCanvasRef.current;
        setParentSignatureData(canvas.toDataURL());
    };

    const clearParentCanvas = () => {
        const canvas = parentCanvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setParentSignatureData(null);
    };
    // --- Kết thúc Logic vẽ chữ ký ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalFormData = {
            ...formData,
            parentSignature: parentSignatureData,
            nganh: nganhHienThiKey // Đảm bảo KEY ngành được lưu
        };
        await saveRegistrationToFirebase(getFromLocalStorage('id'), finalFormData);
        saveToLocalStorage('currentPage', '/payment');
        window.location.href = '/payment';
    };

    return (
        <form className="registration-form" onSubmit={handleSubmit}>
            <h2>{t('registrationForm.title')}</h2>
            <div className="form-section">
                <h3>{t('registrationForm.studentInfo')}</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="saintName">{t('registrationForm.saintName')}</label>
                        <input
                            type="text"
                            id="saintName"
                            name="tenThanh"
                            value={formData.tenThanh}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">{t('registrationForm.lastName')}</label>
                        <input
                            type="text"
                            id="lastName"
                            name="ho"
                            value={formData.ho}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="middleName">{t('registrationForm.middleName')}</label>
                        <input
                            type="text"
                            id="middleName"
                            name="tenDem"
                            value={formData.tenDem}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">{t('registrationForm.firstName')}</label>
                        <input
                            type="text"
                            id="firstName"
                            name="tenGoi"
                            value={formData.tenGoi}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="fatherName">{t('registrationForm.fatherName')}</label>
                        <input
                            type="text"
                            id="fatherName"
                            name="tenCha"
                            value={formData.tenCha}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="motherName">{t('registrationForm.motherName')}</label>
                        <input
                            type="text"
                            id="motherName"
                            name="tenMe"
                            value={formData.tenMe}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="address">{t('registrationForm.address')}</label>
                    <input
                        type="text"
                        id="address"
                        name="diaChi"
                        value={formData.diaChi}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="phoneHome">{t('registrationForm.phoneHome')}</label>
                        <input
                            type="tel"
                            id="phoneHome"
                            name="phoneHome"
                            value={formData.phoneHome}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneCell">{t('registrationForm.phoneCell')}</label>
                        <input
                            type="tel"
                            id="phoneCell"
                            name="phoneCell"
                            value={formData.phoneCell}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="phoneWork">{t('registrationForm.phoneWork')}</label>
                        <input
                            type="tel"
                            id="phoneWork"
                            name="phoneWork"
                            value={formData.phoneWork}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneEmergency">{t('registrationForm.phoneEmergency')}</label>
                        <input
                            type="tel"
                            id="phoneEmergency"
                            name="phoneEmergency"
                            value={formData.phoneEmergency}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="email">{t('registrationForm.email')}</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="birthDate">{t('registrationForm.birthDate')}</label>
                    <input
                        type="date"
                        id="birthDate"
                        name="ngaySinh"
                        value={formData.ngaySinh}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            {/* Phần hiển thị ngành tự động */}
            <div className="form-section">
                <h3>{t('registrationForm.branchTitle')}</h3>
                <p>{t('registrationForm.branchInfo')}</p>
                <div className={`nganh-badge ${nganhHienThiKey}`}>
                    {formData.ngaySinh ? (
                        <strong>{t(`registrationForm.branch.${nganhHienThiKey}`)}</strong>
                    ) : (
                        <p>{t('registrationForm.enterBirthDatePrompt')}</p>
                    )}
                </div>
            </div>

            <div className="form-section">
                <h3>{t('registrationForm.parentGuardianConsent')}</h3>
                <div className="consent-text">
                    <label>{t('registrationForm.consentText')}</label>
                </div>

                <div className="signature-area">
                    <label>{t('registrationForm.signatureLabel')}</label>
                    <canvas
                        ref={parentCanvasRef}
                        className="signature-canvas parent-canvas"
                        width={isMobile ? 300 : 500}
                        height={150}
                        onMouseDown={startParentDrawing}
                        onMouseMove={drawParent}
                        onMouseUp={endParentDrawing}
                        onMouseLeave={endParentDrawing}
                        onTouchStart={startParentDrawing}
                        onTouchMove={drawParent}
                        onTouchEnd={endParentDrawing}
                    />
                    <div className="signature-actions">
                        <button type="button" className="clear-btn" onClick={clearParentCanvas}>
                            <i className="fas fa-eraser"></i> {t('registrationForm.clearSignature')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="submit-btn">{t('registrationForm.nextButton')}</button>
            </div>
        </form>
    );
};

export default RegistrationForm;