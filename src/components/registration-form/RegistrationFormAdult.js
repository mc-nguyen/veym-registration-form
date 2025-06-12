import React, { useState, useRef, useEffect } from "react";
import "./RegistrationForm.css"; // Dùng chung CSS với RegistrationForm
import { saveToLocalStorage, getFromLocalStorage } from '../../context/storageUtils';
import { saveEmailWithID, saveRegistrationToFirebase } from "../../context/firebaseFuncs";
import { useLanguage } from '../../LanguageContext'; // Import useLanguage hook

const RegistrationFormAdult = () => {
    const { translate: t } = useLanguage(); // Lấy hàm translate từ hook

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
            day: "", // New
            month: "", // New
            year: "", // New
            nganh: "",
            signature: null
        };
        return savedData;
    });

    const [isMobile, setIsMobile] = useState(false);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSigned, setHasSigned] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Signature handling
    const startDrawing = (e) => {
        e.preventDefault();
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        const { clientX, clientY } = e.touches ? e.touches[0] : e;
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        ctx.moveTo(x, y);
        setHasSigned(false);
    };

    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { clientX, clientY } = e.touches ? e.touches[0] : e;
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        setHasSigned(true);
    };

    const endDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        if (hasSigned) {
            setFormData(prevData => ({
                ...prevData,
                signature: canvas.toDataURL()
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                signature: null
            }));
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setFormData(prevData => ({
            ...prevData,
            signature: null
        }));
        setHasSigned(false);
    };


    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleNganhChange = (event) => {
        setFormData(prevData => ({
            ...prevData,
            nganh: event.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Simple validation, enhance as needed
        if (!formData.tenThanh || !formData.ho || !formData.tenGoi || !formData.nganh || !formData.signature || !formData.day || !formData.month || !formData.year) {
            alert(t('errors.allFieldsRequired')); // Use translation for alert
            return;
        }

        const finalFormData = {
            ...formData,
            ngaySinh: `${formData.year}-${formData.month}-${formData.day}`, // Combine for backend if needed
        };

        saveToLocalStorage('registrationFormData', finalFormData); // Save the combined data
        saveToLocalStorage('id', await saveRegistrationToFirebase(finalFormData));
        await saveEmailWithID(formData.email, getFromLocalStorage('id'));
        saveToLocalStorage('currentPage', '/payment-adult');
        saveToLocalStorage('nganh', formData.nganh);
        saveToLocalStorage('fullName', [formData.tenGoi, formData.tenDem, formData.ho].join(' ').trim())
        window.location.href = '/payment-adult';
    };

    return (
        <form className="registration-form" onSubmit={handleSubmit}>
            <h2>{t('registrationFormAdult.title')}</h2>
            <div className="form-section">
                <h3>{t('registrationFormAdult.memberInfo')}</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label>{t('registrationFormAdult.saintName')}</label>
                        <input
                            type="text"
                            name="tenThanh"
                            value={formData.tenThanh}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('registrationFormAdult.lastName')}</label>
                        <input
                            type="text"
                            name="ho"
                            value={formData.ho}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>{t('registrationFormAdult.middleName')}</label>
                        <input
                            type="text"
                            name="tenDem"
                            value={formData.tenDem}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('registrationFormAdult.firstName')}</label>
                        <input
                            type="text"
                            name="tenGoi"
                            value={formData.tenGoi}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>{t('registrationFormAdult.address')}</label>
                    <input
                        type="text"
                        name="diaChi"
                        value={formData.diaChi}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>{t('registrationFormAdult.phoneHome')}</label>
                        <input
                            type="tel"
                            name="phoneHome"
                            value={formData.phoneHome}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('registrationFormAdult.phoneCell')}</label>
                        <input
                            type="tel"
                            name="phoneCell"
                            value={formData.phoneCell}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>{t('registrationFormAdult.phoneWork')}</label>
                        <input
                            type="tel"
                            name="phoneWork"
                            value={formData.phoneWork}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('registrationFormAdult.phoneEmergency')}</label>
                        <input
                            type="tel"
                            name="phoneEmergency"
                            value={formData.phoneEmergency}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>{t('registrationFormAdult.email')}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('registrationFormAdult.birthDate')}</label>
                        <div className="date-input-group"> {/* Add a wrapper div for styling */}
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
                                min="1900" // Adjust as needed
                                max={new Date().getFullYear()}
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="divider"></div>

            <div className="form-section">
                <h3>{t('registrationFormAdult.branchTitle')}</h3>
                <p>{t('registrationFormAdult.branchInfo')}</p>
                <div classNames="form-group">
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="nganh"
                            value="Hiệp Sĩ Trưởng Thành"
                            checked={formData.nganh === "Hiệp Sĩ Trưởng Thành"}
                            onChange={handleNganhChange}
                            required
                        />
                        {t('registrationFormAdult.nganhHSTT')}
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="nganh"
                            value="Huynh Trưởng"
                            checked={formData.nganh === "Huynh Trưởng"}
                            onChange={handleNganhChange}
                            required
                        />
                        {t('registrationFormAdult.nganhHT')}
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="nganh"
                            value="Trợ Tá"
                            checked={formData.nganh === "Trợ Tá"}
                            onChange={handleNganhChange}
                            required
                        />
                        {t('registrationFormAdult.nganhTT')}
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="nganh"
                            value="Huấn Luyện Viên"
                            checked={formData.nganh === "Huấn Luyện Viên"}
                            onChange={handleNganhChange}
                            required
                        />
                        {t('registrationFormAdult.nganhHLV')}
                    </label>
                </div>
            </div>

            <div className="divider"></div>

            <div className="form-section">
                <h3>{t('registrationFormAdult.tnttCommitment')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t('registrationFormAdult.commitmentText') }}></p>
                <div className="signature-area">
                    <label>{t('registrationFormAdult.signatureLabel')} {new Date().toLocaleDateString('vi-VN')}</label>
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
                    <button type="button" className="clear-btn" onClick={clearCanvas}>{t('registrationFormAdult.clearSignature')}</button>
                    <p className="signature-note">{t('registrationFormAdult.signatureNote')}</p>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="submit-btn">{t('registrationFormAdult.nextButton')}</button>
            </div>
        </form>
    );
};

export default RegistrationFormAdult;