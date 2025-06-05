import React, { useState, useEffect } from 'react';
import './HealthInfoForm.css';
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../../context/storageUtils';

const HealthInfoFormAdult = ({ onNext }) => {
    removeFromLocalStorage('waiverFormData');
    removeFromLocalStorage('tnttRulesFormData');

    if (!getFromLocalStorage('currentPage'))
        window.location.href = '/';
    else if (getFromLocalStorage('currentPage') !== '/health-info-adult')
        window.location.href = getFromLocalStorage('currentPage');

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
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Health info submitted:', formData);
        saveToLocalStorage('currentPage', '/waiver-release-adult')
        window.location.href = '/waiver-release-adult';
    };

    return (
        <div className="health-form-container">
            <h2>PARTICIPANT AGREEMENT FORM</h2>

            <form onSubmit={handleSubmit}>
                {/* Section 1: Participant Information */}
                <div className="form-section">
                    <h3>PARTICIPANT'S INFORMATION (please print)</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>LAST NAME:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>FIRST NAME:</label>
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
                        <label>ADDRESS:</label>
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
                            <label>CITY:</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>STATE:</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                maxLength="2"
                                style={{ width: '50px' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>ZIP CODE:</label>
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
                            <label>PHONE #:</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>EMAIL:</label>
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
                            <label>BIRTH DATE:</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group radio-group">
                            <label>GENDER:</label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="MALE"
                                    checked={formData.gender === 'MALE'}
                                    onChange={handleChange}
                                    required
                                />
                                MALE
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="FEMALE"
                                    checked={formData.gender === 'FEMALE'}
                                    onChange={handleChange}
                                />
                                FEMALE
                            </label>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>PARISH:</label>
                            <input
                                type="text"
                                name="parish"
                                value="Our Lady of Perpetual Help Church, Riverside, CA"
                                onChange={handleChange}
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label>DIOCESE:</label>
                            <input
                                type="text"
                                name="diocese"
                                value="San Bernadino, CA"
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Health Information */}
                <div className="form-section">
                    <h3>HEALTH INFORMATION</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>DOCTOR:</label>
                            <input
                                type="text"
                                name="doctor"
                                value={formData.doctor}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>DOCTOR PHONE #:</label>
                            <input
                                type="tel"
                                name="doctorPhone"
                                value={formData.doctorPhone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>INSURANCE CO.:</label>
                            <input
                                type="text"
                                name="insuranceCompany"
                                value={formData.insuranceCompany}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>INSURANCE ID #:</label>
                            <input
                                type="text"
                                name="insuranceId"
                                value={formData.insuranceId}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>INSURANCE GROUP #:</label>
                            <input
                                type="text"
                                name="insuranceGroup"
                                value={formData.insuranceGroup}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>CARDHOLDER'S NAME:</label>
                            <input
                                type="text"
                                name="cardholderName"
                                value={formData.cardholderName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>PARTICIPANT'S ALLERGIES (including meds and food):</label>
                        <textarea
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>PARTICIPANT'S CHRONIC MEDICAL CONCERNS (e.g. diabetes, or any mental behavior and health issues, including drug use.):</label>
                        <textarea
                            name="medicalConcerns"
                            value={formData.medicalConcerns}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>PARTICIPANT'S OTHER PHYSICAL RESTRICTIONS:</label>
                        <textarea
                            name="physicalRestrictions"
                            value={formData.physicalRestrictions}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>
                </div>

                {/* Section 3: Emergency Contact */}
                <div className="form-section">
                    <h3>EMERGENCY CONTACT</h3>

                    <div className="form-row">
                        <div className="form-group">
                            <label>NAME:</label>
                            <input
                                type="text"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>PHONE #:</label>
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
                        <label>RELATIONSHIP TO PARTICIPANT:</label>
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
                        Tiếp tục
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HealthInfoFormAdult;