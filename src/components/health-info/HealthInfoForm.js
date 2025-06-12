import React, { useState, useEffect } from 'react';
import './HealthInfoForm.css';
import { saveToLocalStorage, getFromLocalStorage } from '../../context/storageUtils';
import { saveHealthInfoToFirebase } from '../../context/firebaseFuncs';
import { useLanguage } from '../../LanguageContext'; // Import useLanguage hook

const HealthInfoForm = () => {
    const { translate: t } = useLanguage(); // Lấy hàm translate từ hook

    const [formData, setFormData] = useState(() => {
        const savedData = getFromLocalStorage('healthInfoFormData') || {
            lastName: '',
            firstName: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            phone: '',
            email: '',
            birthDate: '',
            isMinor: false,
            gender: '',
            parish: 'Our Lady of Perpetual Help Church, Riverside, CA',
            diocese: 'San Bernadino, CA',
            doctor: '',
            doctorPhone: '',
            insuranceCompany: '',
            insuranceId: '',
            insuranceGroup: '',
            cardholderName: '',
            allergies: '',
            medicalConcerns: '',
            physicalRestrictions: '',
            emergencyContact: '',
            emergencyPhone: '',
            emergencyRelationship: ''
        };
        return savedData;
    });

    useEffect(() => {
        saveToLocalStorage('healthInfoFormData', formData);
        saveHealthInfoToFirebase(getFromLocalStorage('id'), formData);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.lastName) newErrors.lastName = t('errors.required');
        if (!formData.firstName) newErrors.firstName = t('errors.required');
        if (!formData.address) newErrors.address = t('errors.required');
        if (!formData.city) newErrors.city = t('errors.required');
        if (!formData.state) newErrors.state = t('errors.required');
        if (!formData.zipCode) newErrors.zipCode = t('errors.required');
        if (!formData.phone) newErrors.phone = t('errors.required');
        if (!formData.email) newErrors.email = t('errors.required');
        if (!formData.birthDate) newErrors.birthDate = t('errors.required');
        if (!formData.gender) newErrors.gender = t('errors.required');
        if (!formData.parish) newErrors.parish = t('errors.required');
        if (!formData.diocese) newErrors.diocese = t('errors.required');
        if (!formData.doctor) newErrors.doctor = t('errors.required');
        if (!formData.doctorPhone) newErrors.doctorPhone = t('errors.required');
        if (!formData.insuranceCompany) newErrors.insuranceCompany = t('errors.required');
        if (!formData.insuranceId) newErrors.insuranceId = t('errors.required');
        if (!formData.cardholderName) newErrors.cardholderName = t('errors.required');
        if (!formData.emergencyContact) newErrors.emergencyContact = t('errors.required');
        if (!formData.emergencyPhone) newErrors.emergencyPhone = t('errors.required');
        if (!formData.emergencyRelationship) newErrors.emergencyRelationship = t('errors.required');
        
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            saveToLocalStorage('currentPage', '/waiver-release')
            window.location.href = '/waiver-release';
        } else {
            alert(t('errors.formErrors'));
        }
    };

    return (
        <div className="health-form-container">
            <h2>{t('healthInfoForm.title')}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3>{t('healthInfoForm.participantInfo')}</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>{t('healthInfoForm.lastName')}</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('healthInfoForm.firstName')}</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{t('healthInfoForm.address')}</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>{t('healthInfoForm.city')}</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('healthInfoForm.state')}</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('healthInfoForm.zipCode')}</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>{t('healthInfoForm.phone')}</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('healthInfoForm.email')}</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>{t('healthInfoForm.birthDate')}</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="isMinor"
                                    checked={formData.isMinor}
                                    onChange={handleChange}
                                />
                                {t('healthInfoForm.isMinor')}
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{t('healthInfoForm.gender')}</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={formData.gender === 'Male'}
                                    onChange={handleChange}
                                />
                                {t('healthInfoForm.male')}
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={formData.gender === 'Female'}
                                    onChange={handleChange}
                                />
                                {t('healthInfoForm.female')}
                            </label>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>{t('healthInfoForm.parish')}</label>
                            <input
                                type="text"
                                name="parish"
                                value={formData.parish}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('healthInfoForm.diocese')}</label>
                            <input
                                type="text"
                                name="diocese"
                                value={formData.diocese}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="divider"></div>

                <div className="form-section">
                    <h3>{t('healthInfoForm.doctorInfo')}</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>{t('healthInfoForm.doctorName')}</label>
                            <input
                                type="text"
                                name="doctor"
                                value={formData.doctor}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('healthInfoForm.doctorPhone')}</label>
                            <input
                                type="tel"
                                name="doctorPhone"
                                value={formData.doctorPhone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>{t('healthInfoForm.insuranceCompany')}</label>
                            <input
                                type="text"
                                name="insuranceCompany"
                                value={formData.insuranceCompany}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('healthInfoForm.insuranceId')}</label>
                            <input
                                type="text"
                                name="insuranceId"
                                value={formData.insuranceId}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('healthInfoForm.insuranceGroup')}</label>
                            <input
                                type="text"
                                name="insuranceGroup"
                                value={formData.insuranceGroup}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>{t('healthInfoForm.cardholderName')}</label>
                        <input
                            type="text"
                            name="cardholderName"
                            value={formData.cardholderName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="divider"></div>

                <div className="form-section">
                    <h3>{t('healthInfoForm.medicalHistory')}</h3>
                    <div className="form-group">
                        <label>{t('healthInfoForm.allergies')}</label>
                        <textarea
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>{t('healthInfoForm.medicalConcerns')}</label>
                        <textarea
                            name="medicalConcerns"
                            value={formData.medicalConcerns}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>{t('healthInfoForm.physicalRestrictions')}</label>
                        <textarea
                            name="physicalRestrictions"
                            value={formData.physicalRestrictions}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>

                <div className="divider"></div>

                <div className="form-section">
                    <h3>{t('healthInfoForm.emergencyContact')}</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>{t('healthInfoForm.contactName')}</label>
                            <input
                                type="text"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('healthInfoForm.emergencyPhone')}</label>
                            <input
                                type="tel"
                                name="emergencyPhone"
                                value={formData.emergencyPhone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{t('healthInfoForm.relationship')}</label>
                        <input
                            type="text"
                            name="emergencyRelationship"
                            value={formData.emergencyRelationship}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        {t('healthInfoForm.continueButton')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HealthInfoForm;