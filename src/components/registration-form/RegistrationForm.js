// RegistrationForm.js
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./RegistrationForm.css";
import { saveToLocalStorage, getFromLocalStorage } from '../../context/storageUtils';
import { saveRegistrationToFirebase, updateRegistrationInFirebase, getEmailBlacklist, getPhoneBlacklist } from "../../context/firebaseFuncs";
import { useLanguage } from '../../LanguageContext';
import SignatureCanvas from '../signature/SignatureCanvas'; // Import the new component
import { extractDigits, formatPhoneNumber } from "../../context/utilFuncs";

const RegistrationForm = () => {
    const { translate: t } = useLanguage();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(() => {
        const savedData = getFromLocalStorage('registrationFormData') || {
            tenThanh: "",
            ho: "",
            tenDem: "",
            tenGoi: "",
            tenCha: "",
            tenMe: "",
            phoneCha: "",
            phoneMe: "",
            diaChi: "",
            phoneHome: "",
            phoneCell: "",
            phoneWork: "",
            phoneEmergency: "",
            email: "",
            ngaySinh: "", // Changed to single field for full date
            nganh: ""
        };
        return savedData;
    });

    const [emailBlacklist, setEmailBlacklist] = useState([]);
    const [phoneBlacklist, setPhoneBlacklist] = useState([]);

    // Load blacklist khi component được mount
    useEffect(() => {
        const fetchBlacklists = async () => {
            const emails = await getEmailBlacklist();
            const phones = await getPhoneBlacklist();
            setEmailBlacklist(emails);
            setPhoneBlacklist(phones);
        };
        fetchBlacklists();
    }, []);

    const [nganhHienThiKey, setNganhHienThiKey] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    // Parent Signature States
    const [parentSignatureData, setParentSignatureData] = useState(null);
    const [hasParentDrawn, setHasParentDrawn] = useState(false);

    // Student Signature States (NEW)
    const [studentSignatureData, setStudentSignatureData] = useState(null);
    const [hasStudentDrawn, setHasStudentDrawn] = useState(false);

    const calculateNganhKey = (birthDateString) => {
        if (!birthDateString) return "";

        const birthDate = new Date(birthDateString);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Mapping age to nganh based on the original birth year mapping provided
        // Example: If 2019 born is AU_NHI_DU_BI, and current year is 2025, then age is 6.
        // So, AU_NHI_DU_BI corresponds to age 6.
        switch (age) {
            case 6: return "AU_NHI_DU_BI";
            case 7: return "AU_NHI_CAP_1";
            case 8: return "AU_NHI_CAP_2";
            case 9: return "AU_NHI_CAP_3";
            case 10: return "THIEU_NHI_CAP_1";
            case 11: return "THIEU_NHI_CAP_2";
            case 12: return "THIEU_NHI_CAP_3";
            case 13: return "NGHIA_SI_CAP_1";
            case 14: return "NGHIA_SI_CAP_2";
            case 15: return "NGHIA_SI_CAP_3";
            case 16: return "HIEP_SI_CAP_1";
            case 17: return "HIEP_SI_CAP_2";
            default: return "INVALID_BRANCH";
        }
    };

    useEffect(() => {
        saveToLocalStorage('registrationFormData', formData);
        const calculatedNganhKey = calculateNganhKey(formData.ngaySinh); // Pass full date string
        setNganhHienThiKey(calculatedNganhKey);
        setFormData(prevData => ({ ...prevData, nganh: calculatedNganhKey }));

        if (formData.studentSignature) {
            setHasStudentDrawn(true);
            setStudentSignatureData(formData.studentSignature);
        }
        if (formData.parentSignature) {
            setHasParentDrawn(true);
            setParentSignatureData(formData.parentSignature);
        }

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [formData, t, formData.studentSignature, formData.parentSignature]);

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

        // Kiểm tra email và số điện thoại trong danh sách đen
        if (emailBlacklist.includes(formData.email.toLowerCase())) {
            alert(t('registrationForm.emailBlockedMessage'));
            navigate('/');
            return;
        }
        if (phoneBlacklist.includes(extractDigits(formData.phoneCha)) || phoneBlacklist.includes(extractDigits(formData.phoneMe))) {
            alert(t('registrationForm.phoneBlockedMessage'));
            navigate('/');
            return;
        }

        // Retrieve existing ID from local storage
        const existingId = getFromLocalStorage('id');

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
            ngaySinh: formData.ngaySinh, // Already in YYYY-MM-DD format
            parentSignature: parentSignatureData,
            studentSignature: studentSignatureData, // Include student signature (NEW)
            dateSigned: new Date().toLocaleDateString(),
            nganh: t(`registrationForm.branch.${nganhHienThiKey}`),
            phoneHome: formatPhoneNumber(formData.phoneHome),
            phoneCell: formatPhoneNumber(formData.phoneCell),
            phoneWork: formatPhoneNumber(formData.phoneWork),
            phoneCha: formatPhoneNumber(formData.phoneCha),
            phoneMe: formatPhoneNumber(formData.phoneMe),
            phoneEmergency: formatPhoneNumber(formData.phoneEmergency)
        };

        if (existingId) {
            // If an ID exists, update the existing document
            await updateRegistrationInFirebase(existingId, finalFormData);
        } else {
            // If no ID exists, create a new document
            const newId = await saveRegistrationToFirebase(finalFormData);
            saveToLocalStorage('id', newId);
        }

        saveToLocalStorage('currentPage', '/health-info');
        saveToLocalStorage('nganh', t(`registrationForm.branch.${nganhHienThiKey}`).split(' ').slice(0, 2).join(' '));
        saveToLocalStorage('fullName', [formData.tenGoi, formData.tenDem, formData.ho].join(' ').trim())
        window.location.href = '/health-info';
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

                <hr />

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
                        <label htmlFor="phoneCha">{t('registrationForm.phoneCha')}</label>
                        <input
                            type="tel"
                            id="phoneCha"
                            name="phoneCha"
                            value={formData.phoneCha}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
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
                    <div className="form-group">
                        <label htmlFor="phoneMe">{t('registrationForm.phoneMe')}</label>
                        <input
                            type="tel"
                            id="phoneMe"
                            name="phoneMe"
                            value={formData.phoneMe}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <hr />

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

                <hr />

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
                        max={new Date().toISOString().split('T')[0]} // Prevents future dates
                        required
                    />
                </div>
            </div>

            <div className="form-section">
                <h3>{t('registrationForm.branchTitle')}</h3>
                <p>{t('registrationForm.branchInfo')}</p>
                <div className={`nganh-badge ${nganhHienThiKey}`}>
                    {formData.ngaySinh ? ( // Check if full date is entered
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
                        dataImage={studentSignatureData}
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
                        dataImage={parentSignatureData}
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