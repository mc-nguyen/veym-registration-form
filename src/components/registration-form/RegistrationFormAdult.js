// RegistrationFormAdult.js
import React, { useState, useRef, useEffect } from "react";
import "./RegistrationForm.css";
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../../context/storageUtils';
import { saveRegistrationToFirebase } from "../../context/firebaseFuncs";
import { useLanguage } from '../../LanguageContext'; // Import useLanguage hook

const RegistrationFormAdult = () => {
    const { translate: t, language } = useLanguage(); // Initialize t and language

    removeFromLocalStorage('healthInfoFormData');
    removeFromLocalStorage('waiverFormData');
    removeFromLocalStorage('tnttRulesFormData');
    removeFromLocalStorage('paymentFormData');

    if (!getFromLocalStorage('currentPage'))
        window.location.href = '/';
    else if (getFromLocalStorage('currentPage') !== '/registration-adult')
        window.location.href = getFromLocalStorage('currentPage');

    const [formData, setFormData] = useState(() => {
        const savedData = getFromLocalStorage('registrationFormData') || {
            tenThanh: "",
            ho: "",
            tenDem: "",
            tenGoi: "",
            diaChi: "",
            phoneHome: "",
            phoneCell: "",
            phoneWork: "",
            phoneEmergency: "",
            email: "",
            ngaySinh: "",
            nganh: ""
        };
        return savedData;
    });

    const [isMobile, setIsMobile] = useState(false);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        saveToLocalStorage('registrationFormData', formData);
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        ctx.beginPath();
        ctx.moveTo(
            (e.clientX || e.touches[0].clientX) - rect.left,
            (e.clientY || e.touches[0].clientY) - rect.top
        );
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        ctx.lineTo(
            (e.clientX || e.touches[0].clientX) - rect.left,
            (e.clientY || e.touches[0].clientY) - rect.top
        );
        ctx.strokeStyle = '#2d8fdd';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    };

    const endDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const confirmationMessage = t('registrationForm.confirmMessageAdult', {
            lastName: formData.ho,
            middleName: formData.tenDem,
            firstName: formData.tenGoi,
            dob: formData.ngaySinh || t('notEntered'),
            branch: formData.nganh || t('notDetermined')
        });

        const isConfirmed = window.confirm(confirmationMessage);

        if (isConfirmed) {
            const registrationData = {
                ...formData,
                signature: canvasRef.current.toDataURL(),
                signedDate: new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')
            };

            console.log('Dữ liệu đã gửi:', registrationData);
            const dataID = await saveRegistrationToFirebase(registrationData);
            saveToLocalStorage('id', dataID);

            setTimeout(() => {
                saveToLocalStorage('currentPage', '/payment-adult');
                window.location.href = '/payment-adult';
            }, 1000);
        }
    };

    return (
        <form className="registration-form" onSubmit={handleSubmit}>
            <h2>{t('registrationForm.title')}</h2>
            <p className="form-subtitle">{t('registrationForm.subtitle')}</p>

            <div className="form-section">
                <h3>{t('registrationForm.personalInfo')}</h3>

                <div className="form-group">
                    <label>{t('registrationForm.nameIs')}</label>
                    <div className="name-row">
                        <input type="text" name="tenThanh" placeholder={t('registrationForm.saintName')} value={formData.tenThanh} onChange={handleChange} required />
                        <input type="text" name="ho" placeholder={t('registrationForm.lastName')} value={formData.ho} onChange={handleChange} required />
                        <input type="text" name="tenDem" placeholder={t('registrationForm.middleName')} value={formData.tenDem} onChange={handleChange} />
                        <input type="text" name="tenGoi" placeholder={t('registrationForm.firstName')} value={formData.tenGoi} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>{t('registrationForm.homeAddress')}</label>
                    <input type="text" name="diaChi" value={formData.diaChi} onChange={handleChange} required />
                </div>
            </div>

            <div className="form-section">
                <h3>{t('registrationForm.contactInfo')}</h3>

                <div className="form-group">
                    <label>{t('registrationForm.contactPhone')}</label>
                    <div className="phone-row">
                        <input type="tel" name="phoneHome" placeholder={t('registrationForm.home')} value={formData.phoneHome} onChange={handleChange} />
                        <input type="tel" name="phoneCell" placeholder={t('registrationForm.cell')} value={formData.phoneCell} onChange={handleChange} required />
                        <input type="tel" name="phoneWork" placeholder={t('registrationForm.work')} value={formData.phoneWork} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label>{t('registrationForm.emergencyPhone')}</label>
                    <input type="tel" name="phoneEmergency" placeholder={t('registrationForm.emergencyNumber')} value={formData.phoneEmergency} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>{t('registrationForm.email')}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
            </div>

            <div className="form-section">
                <h3>{t('registrationForm.activityInfo')}</h3>

                <div className="form-group">
                    <label>{t('registrationForm.dob')}</label>
                    <div className="dob-row">
                        <input type="date" name="ngaySinh" value={formData.ngaySinh} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>{t('registrationForm.branchAdult')}</label>
                    <select
                        name="nganh"
                        value={formData.nganh || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">{t('registrationForm.selectBranch')}</option>
                        <option value="Hiệp Sĩ Trưởng Thành">{t('registrationForm.branchLabels.hiepSiTruongThanh')}</option>
                        <option value="Huynh Trưởng">{t('registrationForm.branchLabels.huynhTruong')}</option>
                        <option value="Trợ Tá">{t('registrationForm.branchLabels.troTa')}</option>
                        <option value="Huấn Luyện Viên">{t('registrationForm.branchLabels.huanLuyenVien')}</option>
                    </select>
                </div>
            </div>

            <div className="form-section pledge-section">
                <h3>{t('registrationForm.pledge')}</h3>
                <div className="pledge">
                    <p dangerouslySetInnerHTML={{ __html: t('registrationForm.pledgeText') }}></p>
                </div>

                <div className="signature-area">
                    <label>{t('registrationForm.studentSignature')} {new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}</label>
                    <canvas
                        ref={canvasRef}
                        width={isMobile ? 300 : 500}
                        height={150}
                        className="signature-canvas"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={endDrawing}
                        onMouseLeave={endDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={endDrawing}
                    />
                    <button type="button" className="clear-btn" onClick={clearCanvas}>{t('registrationForm.clearSignature')}</button>
                    <p className="signature-note">{t('registrationForm.signHere')}</p>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="submit-btn">{t('registrationForm.next')}</button>
            </div>
        </form>
    );
};

export default RegistrationFormAdult;