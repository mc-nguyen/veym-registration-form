import React, { useState } from 'react';
import { useLanguage } from '../../LanguageContext'; // Import useLanguage hook
import './ParentSurveyForm.css';
import { saveParentSurvey } from '../../context/firebaseFuncs';

const ParentSurveyForm = () => {
    const { translate: t } = useLanguage(); // Lấy hàm translate (đổi tên thành t) và các giá trị khác

    const initialParentState = {
        parentName: '',
        parentPhone: '', // New field for phone number
        parentEmail: '', // New field for email
        activityVolunteer: { // New object for activity options
            assistant: false,
            cookChildren: false,
            teaching: false,
            finance: false,
            liturgy: false,
            medical: false,
            canHelpFoodService: false,
            canHelpFoodPurchase: false,
        },
        otherNotes: ''
    };

    const [parents, setParents] = useState([initialParentState]);

    const handleInputChange = (index, event) => {
        const { name, value, type, checked } = event.target;
        const newParents = [...parents];

        if (name.startsWith('activityVolunteer.')) {
            const activityName = name.split('.')[1];
            newParents[index] = {
                ...newParents[index],
                activityVolunteer: {
                    ...newParents[index].activityVolunteer,
                    [activityName]: checked,
                },
            };
        } else {
            newParents[index] = {
                ...newParents[index],
                [name]: type === 'checkbox' ? checked : value,
            };
        }
        setParents(newParents);
    };

    const addParent = () => {
        if (parents.length < 3) {
            setParents([...parents, initialParentState]);
        } else {
            alert(t('surveyPage.maxParentsAlert')); // Sử dụng t() với key đầy đủ
        }
    };

    const removeParent = (index) => {
        const newParents = parents.filter((_, i) => i !== index);
        setParents(newParents);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Dữ liệu khảo sát:', parents);
        alert(t('surveyPage.thankYouAlert')); // Sử dụng t() với key đầy đủ
        // Tùy chọn: Reset form sau khi gửi
        await saveParentSurvey(parents);
        setParents([initialParentState]);
        window.location.href = '/processing';
    };

    return (
        <div className="survey-container">
            <h1>{t('surveyPage.surveyTitle')}</h1>
            <p>{t('surveyPage.surveyIntro')}</p>
            <form onSubmit={handleSubmit}>
                {parents.map((parent, index) => (
                    <div key={index} className="parent-section">
                        {/* Truy cập khóa lồng nhau và nối chuỗi */}
                        <h2>{t('surveyPage.parentInfo')} {index + 1}</h2>
                        <div className="form-group">
                            <label htmlFor={`parentName-${index}`}>{t('surveyPage.parentNameLabel')}</label>
                            <input
                                type="text"
                                id={`parentName-${index}`}
                                name="parentName"
                                value={parent.parentName}
                                onChange={(e) => handleInputChange(index, e)}
                                required
                            />
                        </div>

                        {/* New field: Phone Number */}
                        <div className="form-group">
                            <label htmlFor={`parentPhone-${index}`}>{t('surveyPage.parentPhoneLabel')}</label>
                            <input
                                type="tel" // Use type="tel" for phone numbers
                                id={`parentPhone-${index}`}
                                name="parentPhone"
                                value={parent.parentPhone}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                        </div>

                        {/* New field: Email */}
                        <div className="form-group">
                            <label htmlFor={`parentEmail-${index}`}>{t('surveyPage.parentEmailLabel')}</label>
                            <input
                                type="email" // Use type="email" for email addresses
                                id={`parentEmail-${index}`}
                                name="parentEmail"
                                value={parent.parentEmail}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <p>{t('surveyPage.helpOptionsIntro')}</p> {/* Dịch dòng giới thiệu */}
                            <label>
                                <input
                                    type="checkbox"
                                    name="activityVolunteer.canHelpFoodService"
                                    checked={parent.activityVolunteer.canHelpFoodService}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                                {t('surveyPage.canHelpFoodService')}
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="activityVolunteer.canHelpFoodPurchase"
                                    checked={parent.activityVolunteer.canHelpFoodPurchase}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                                {t('surveyPage.canHelpFoodPurchase')}
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="activityVolunteer.assistant"
                                    checked={parent.activityVolunteer.assistant}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                                {t('surveyPage.activityAssistant')}
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="activityVolunteer.cookChildren"
                                    checked={parent.activityVolunteer.cookChildren}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                                {t('surveyPage.activityCookChildren')}
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="activityVolunteer.teaching"
                                    checked={parent.activityVolunteer.teaching}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                                {t('surveyPage.activityTeaching')}
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="activityVolunteer.finance"
                                    checked={parent.activityVolunteer.finance}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                                {t('surveyPage.activityFinance')}
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="activityVolunteer.liturgy"
                                    checked={parent.activityVolunteer.liturgy}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                                {t('surveyPage.activityLiturgy')}
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="activityVolunteer.medical"
                                    checked={parent.activityVolunteer.medical}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                                {t('surveyPage.activityMedical')}
                            </label>
                        </div>

                        <div className="form-group">
                            <label htmlFor={`otherNotes-${index}`}>{t('surveyPage.otherNotesLabel')}</label>
                            <textarea
                                id={`otherNotes-${index}`}
                                name="otherNotes"
                                value={parent.otherNotes}
                                onChange={(e) => handleInputChange(index, e)}
                                rows="4"
                            ></textarea>
                        </div>

                        {parents.length > 1 && (
                            <button type="button" onClick={() => removeParent(index)} className="remove-button">
                                {t('surveyPage.removeParentButton')} {index + 1}
                            </button>
                        )}
                    </div>
                ))}

                {parents.length < 3 && (
                    <button type="button" onClick={addParent} className="add-button">
                        {t('surveyPage.addParentButton')}
                    </button>
                )}

                <button type="submit" className="submit-button">
                    {t('surveyPage.submitButton')}
                </button>
            </form>
        </div>
    );
};

export default ParentSurveyForm;