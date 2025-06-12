import React, { useState } from 'react';
import { useLanguage } from '../../LanguageContext'; // Import useLanguage hook
import './ParentSurveyForm.css';

const ParentSurveyForm = () => {
    const { translate: t } = useLanguage(); // Lấy hàm translate (đổi tên thành t) và các giá trị khác

    const initialParentState = {
        parentName: '',
        canHelpFoodService: false,
        canHelpFoodPurchase: false,
        otherNotes: '',
    };

    const [parents, setParents] = useState([initialParentState]);

    const handleInputChange = (index, event) => {
        const { name, value, type, checked } = event.target;
        const newParents = [...parents];
        newParents[index] = {
            ...newParents[index],
            [name]: type === 'checkbox' ? checked : value,
        };
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

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Dữ liệu khảo sát:', parents);
        alert(t('surveyPage.thankYouAlert')); // Sử dụng t() với key đầy đủ
        // Tùy chọn: Reset form sau khi gửi
        setParents([initialParentState]);
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

                        <div className="form-group checkbox-group">
                            <p>{t('surveyPage.helpOptionsIntro')}</p> {/* Dịch dòng giới thiệu */}
                            <label>
                                <input
                                    type="checkbox"
                                    name="canHelpFoodService"
                                    checked={parent.canHelpFoodService}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                                {t('surveyPage.canHelpFoodService')}
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="canHelpFoodPurchase"
                                    checked={parent.canHelpFoodPurchase}
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                                {t('surveyPage.canHelpFoodPurchase')}
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
                <div style={{ textAlign: "right", paddingTop: 10 }}>
                    <a href='/generate-pdf'>
                        {t('surveyPage.cancel')}
                    </a>
                </div>
            </form>
        </div>
    );
};

export default ParentSurveyForm;