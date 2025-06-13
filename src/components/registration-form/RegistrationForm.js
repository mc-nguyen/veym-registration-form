// RegistrationForm.js
import React, { useState, useEffect } from "react";
import "./RegistrationForm.css";
import { saveToLocalStorage, getFromLocalStorage } from '../../context/storageUtils';
import { saveRegistrationToFirebase } from "../../context/firebaseFuncs";
import { useLanguage } from '../../LanguageContext';
import SignatureCanvas from '../signature/SignatureCanvas'; // Import the new component

const RegistrationForm = () => {
    const { translate: t } = useLanguage();

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
            day: "",
            month: "",
            year: "",
            nganh: ""
        };
        return savedData;
    });

    const [nganhHienThiKey, setNganhHienThiKey] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    // Parent Signature States
    const [parentSignatureData, setParentSignatureData] = useState(null);
    const [hasParentDrawn, setHasParentDrawn] = useState(false);

    // Student Signature States (NEW)
    const [studentSignatureData, setStudentSignatureData] = useState(null);
    const [hasStudentDrawn, setHasStudentDrawn] = useState(false);

    const calculateNganhKey = (day, month, year) => {
        if (!day || !month || !year) return "";

        const birthYear = parseInt(year, 10);
        switch (birthYear) {
            case 2019: return "AU_NHI_DU_BI";
            case 2018: return "AU_NHI_CAP_1";
            case 2017: return "AU_NHI_CAP_2";
            case 2016: return "AU_NHI_CAP_3";
            case 2015: return "THIEU_NHI_CAP_1";
            case 2014: return "THIEU_NHI_CAP_2";
            case 2013: return "THIEU_NHI_CAP_3";
            case 2012: return "NGHIA_SI_CAP_1";
            case 2011: return "NGHIA_SI_CAP_2";
            case 2010: return "NGHIA_SI_CAP_3";
            case 2009: return "HIEP_SI_CAP_1";
            case 2008: return "HIEP_SI_CAP_2";
            default: return "INVALID_BRANCH";
        }
    };

    useEffect(() => {
        saveToLocalStorage('registrationFormData', formData);
        const calculatedNganhKey = calculateNganhKey(formData.day, formData.month, formData.year);
        setNganhHienThiKey(calculatedNganhKey);
        setFormData(prevData => ({ ...prevData, nganh: calculatedNganhKey }));

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [formData, t]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Parent Signature Callbacks
    const handleParentSignatureSave = (signatureData) => {
        setParentSignatureData(signatureData);
        setHasParentDrawn(signatureData !== null);
    };

    const handleParentSignatureClear = () => {
        setParentSignatureData(null);
        setHasParentDrawn(false);
    };

    // Student Signature Callbacks (NEW)
    const handleStudentSignatureSave = (signatureData) => {
        setStudentSignatureData(signatureData);
        setHasStudentDrawn(signatureData !== null);
    };

    const handleStudentSignatureClear = () => {
        setStudentSignatureData(null);
        setHasStudentDrawn(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate both signatures
        if (!hasParentDrawn) {
            alert(t('registrationForm.signatureRequestParent')); // You might want a specific message for parent
            return;
        }
        if (!hasStudentDrawn) {
            alert(t('registrationForm.signatureRequestStudent')); // New specific message for student
            return;
        }

        const finalFormData = {
            ...formData,
            ngaySinh: `${formData.year}-${formData.month}-${formData.day}`,
            parentSignature: parentSignatureData,
            studentSignature: studentSignatureData, // Include student signature (NEW)
            dateSigned: new Date().toLocaleDateString(),
            nganh: t(`registrationForm.branch.${nganhHienThiKey}`)
        };
        saveToLocalStorage('id', await saveRegistrationToFirebase(finalFormData));
        saveToLocalStorage('currentPage', '/payment');
        saveToLocalStorage('nganh', t(`registrationForm.branch.${nganhHienThiKey}`).split(' ').slice(0, 2).join(' '));
        saveToLocalStorage('fullName', [formData.tenGoi, formData.tenDem, formData.ho].join(' ').trim())
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
                    <label>{t('registrationForm.birthDate')}</label>
                    <div className="date-input-group">
                        <input
                            type="number"
                            placeholder={t('registrationForm.common.day')}
                            name="day"
                            value={formData.day}
                            onChange={handleChange}
                            min="1"
                            max="31"
                            required
                        />
                        <input
                            type="number"
                            placeholder={t('registrationForm.common.month')}
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            min="1"
                            max="12"
                            required
                        />
                        <input
                            type="number"
                            placeholder={t('registrationForm.common.year')}
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            min="1900"
                            max={new Date().getFullYear()}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>{t('registrationForm.branchTitle')}</h3>
                <p>{t('registrationForm.branchInfo')}</p>
                <div className={`nganh-badge ${nganhHienThiKey}`}>
                    {formData.day && formData.month && formData.year ? (
                        <strong>{t(`registrationForm.branch.${nganhHienThiKey}`)}</strong>
                    ) : (
                        <p>{t('registrationForm.enterBirthDatePrompt')}</p>
                    )}
                </div>
            </div>

            {/* Student Signature Section (NEW) */}
            <div className="form-section">
                <h3>{t('registrationForm.studentSignatureTitle')}</h3> {/* New title for student signature */}
                <div className="consent-text">
                    <label>{t('registrationForm.studentSignatureConsentText')}</label> {/* New consent text for student */}
                </div>

                <div className="signature-area">
                    <label>{t('registrationForm.studentSignatureLabel')}</label> {/* New label for student signature */}
                    <SignatureCanvas
                        onSave={handleStudentSignatureSave}
                        onClear={handleStudentSignatureClear}
                        width={isMobile ? 300 : 500}
                        height={150}
                    />
                </div>
            </div>

            {/* Parent/Guardian Signature Section */}
            <div className="form-section">
                <h3>{t('registrationForm.parentGuardianConsent')}</h3>
                <div className="consent-text">
                    <label>{t('registrationForm.consentText')}</label>
                </div>

                <div className="signature-area">
                    <label>{t('registrationForm.signatureLabel')}</label>
                    <SignatureCanvas
                        onSave={handleParentSignatureSave}
                        onClear={handleParentSignatureClear}
                        width={isMobile ? 300 : 500}
                        height={150}
                    />
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="submit-btn">{t('registrationForm.nextButton')}</button>
            </div>
        </form>
    );
};

export default RegistrationForm;