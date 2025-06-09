// RegistrationForm.js
import React, { useState, useRef, useEffect } from "react";
import "./RegistrationForm.css";
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../../context/storageUtils';
import { saveRegistrationToFirebase } from "../../context/firebaseFuncs";
import { useLanguage } from '../../LanguageContext'; // Import useLanguage hook

const RegistrationForm = () => {
    const { translate: t, language } = useLanguage(); // Initialize t and language

    removeFromLocalStorage('healthInfoFormData');
    removeFromLocalStorage('waiverFormData');
    removeFromLocalStorage('tnttRulesFormData');
    removeFromLocalStorage('paymentFormData');

    if (!getFromLocalStorage('currentPage'))
        window.location.href = '/';
    else if (getFromLocalStorage('currentPage') !== '/registration')
        window.location.href = getFromLocalStorage('currentPage');

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
        };
        return savedData;
    });

    const [nganh, setNganh] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [parentSignature, setParentSignature] = useState({
        name: '',
        relationship: 'Mẹ',
        date: new Date().toISOString().split('T')[0],
        signedImage: null
    });

    const parentCanvasRef = useRef(null);
    const [isParentDrawing, setIsParentDrawing] = useState(false);

    useEffect(() => {
        saveToLocalStorage('registrationFormData', formData);
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [formData]);

    const tinhNganh = (ngaySinhStr) => {
        if (!ngaySinhStr) return null;

        const birthDate = new Date(ngaySinhStr);
        const sep1 = new Date(new Date().getFullYear(), 8, 1);
        let age = sep1.getFullYear() - birthDate.getFullYear();

        if (birthDate.getMonth() > 8 || (birthDate.getMonth() === 8 && birthDate.getDate() > 1)) {
            age--;
        }

        const nganhData = [
            { minAge: 17, maxAge: 17, label: t('registrationForm.branchLabels.hiepSiCap2'), color: "brown" },
            { minAge: 16, maxAge: 16, label: t('registrationForm.branchLabels.hiepSiCap1'), color: "brown" },
            { minAge: 15, maxAge: 15, label: t('registrationForm.branchLabels.nghiaSiCap3'), color: "gold" },
            { minAge: 14, maxAge: 14, label: t('registrationForm.branchLabels.nghiaSiCap2'), color: "gold" },
            { minAge: 13, maxAge: 13, label: t('registrationForm.branchLabels.nghiaSiCap1'), color: "gold" },
            { minAge: 12, maxAge: 12, label: t('registrationForm.branchLabels.thieuNhiCap3'), color: "blue" },
            { minAge: 11, maxAge: 11, label: t('registrationForm.branchLabels.thieuNhiCap2'), color: "blue" },
            { minAge: 10, maxAge: 10, label: t('registrationForm.branchLabels.thieuNhiCap1'), color: "blue" },
            { minAge: 9, maxAge: 9, label: t('registrationForm.branchLabels.auNhiCap3'), color: "green" },
            { minAge: 8, maxAge: 8, label: t('registrationForm.branchLabels.auNhiCap2'), color: "green" },
            { minAge: 7, maxAge: 7, label: t('registrationForm.branchLabels.auNhiCap1'), color: "green" },
            { minAge: 6, maxAge: 6, label: t('registrationForm.branchLabels.auNhiDuBi'), color: "green" }
        ];

        return nganhData.find(item =>
            age >= item.minAge &&
            (!item.maxAge || age <= item.maxAge)
        ) || null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "ngaySinh") {
            setNganh(tinhNganh(value));
        }
    };

    const startDrawing = (e) => {
        e.preventDefault();
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
        e.preventDefault();
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

        if (!parentSignature.signedImage) {
            alert(t('registrationForm.pleaseSignParent'));
            return;
        }

        const confirmationMessage = t('registrationForm.confirmMessageStudent', {
            lastName: formData.ho,
            middleName: formData.tenDem,
            firstName: formData.tenGoi,
            dob: formData.ngaySinh || t('notEntered'),
            branch: nganh?.label || t('notDetermined'),
            parentName: parentSignature.name,
            parentRelationship: t(`registrationForm.${parentSignature.relationship.toLowerCase()}`) // Translate relationship
        });

        const isConfirmed = window.confirm(confirmationMessage);

        if (isConfirmed) {
            const registrationData = {
                ...formData,
                registrationType: "student",
                studentSignature: canvasRef.current.toDataURL(),
                studentSignedDate: new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US'),
                parentSignature: {
                    ...parentSignature,
                    signedDate: new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')
                }
            };

            console.log('Dữ liệu đã gửi:', registrationData);
            const dataID = await saveRegistrationToFirebase(registrationData);
            saveToLocalStorage('id', dataID);

            setTimeout(() => {
                saveToLocalStorage('currentPage', '/payment');
                window.location.href = '/payment';
            }, 1000);
        }
    };

    const startParentDrawing = (e) => {
        e.preventDefault();
        const canvas = parentCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
        setIsParentDrawing(true);
    };

    const drawParent = (e) => {
        if (!isParentDrawing) return;
        e.preventDefault();

        const canvas = parentCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.strokeStyle = '#d32f2f';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    };

    const endParentDrawing = () => {
        setIsParentDrawing(false);
        setParentSignature(prev => ({
            ...prev,
            signedImage: parentCanvasRef.current.toDataURL()
        }));
    };

    const clearParentCanvas = () => {
        const canvas = parentCanvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setParentSignature(prev => ({ ...prev, signedImage: null }));
    };

    const handleParentInfoChange = (e) => {
        const { name, value } = e.target;
        setParentSignature(prev => ({
            ...prev,
            [name]: name === 'name' ? value.toUpperCase() : value
        }));
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
                    <label>{t('registrationForm.sonOf')}</label>
                    <div className="parent-row">
                        <input type="text" name="tenCha" placeholder={t('registrationForm.fatherName')} value={formData.tenCha} onChange={handleChange} required />
                        <input type="text" name="tenMe" placeholder={t('registrationForm.motherName')} value={formData.tenMe} onChange={handleChange} required />
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
                        <button type="button" className="secondary-btn" onClick={() => setNganh(tinhNganh(formData.ngaySinh))}>
                            {t('registrationForm.determineBranch')}
                        </button>
                    </div>
                </div>

                {nganh && (
                    <div className="nganh-result">
                        <div className={`nganh-display ${nganh.color}`}>
                            <span className="arrow">➤</span> {t('registrationForm.branch')} {nganh.label}
                        </div>
                    </div>
                )}
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

            <div className="parent-signature-section">
                <h3 className="section-title">{t('registrationForm.parentConfirmation')}</h3>

                <div className="parent-info-grid">
                    <div className="form-group">
                        <label>{t('registrationForm.parentName')}</label>
                        <input
                            type="text"
                            name="name"
                            value={parentSignature.name}
                            onChange={handleParentInfoChange}
                            placeholder={t('registrationForm.parentName')}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>{t('registrationForm.relationship')}</label>
                        <select
                            name="relationship"
                            value={parentSignature.relationship}
                            onChange={handleParentInfoChange}
                            required
                        >
                            <option value="Mẹ">{t('registrationForm.mother')}</option>
                            <option value="Cha">{t('registrationForm.father')}</option>
                            <option value="Người giám hộ">{t('registrationForm.guardian')}</option>
                            <option value="Khác">{t('registrationForm.other')}</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{t('registrationForm.signedDate')} {new Date().toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}</label>
                    </div>

                    <div className="form-group">
                        <label dangerouslySetInnerHTML={{ __html: t('registrationForm.parentResponsibility') }}></label>
                    </div>
                </div>

                <div className="signature-area">
                    <label>{t('registrationForm.parentSignature')}</label>
                    <canvas
                        ref={parentCanvasRef}
                        className="signature-canvas parent-canvas"
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
                <button type="submit" className="submit-btn">{t('registrationForm.next')}</button>
            </div>
        </form>
    );
};

export default RegistrationForm;