import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GuidePage.css';
import { useLanguage } from '../LanguageContext';

import step1Image from '../assets/guidelines/step1.png';
import step2Image from '../assets/guidelines/step2.png';
import step3Image from '../assets/guidelines/step3.png';
import step4aImage from '../assets/guidelines/step4a.png';
import step4bImage from '../assets/guidelines/step4b.png';
import step5Image from '../assets/guidelines/step5.png';
import step6Image from '../assets/guidelines/step6.png';
import step7Image from '../assets/guidelines/step7.png';
import step8Image from '../assets/guidelines/step8.png';
import step9Image from '../assets/guidelines/step9.png';
import step10Image from '../assets/guidelines/step10.png';

const GuidePage = () => {
    const navigate = useNavigate();
    const { translate: t } = useLanguage();

    return (
        <div className="guide-container">
            <h1>{t('guidePage.title')}</h1>

            <div className="guide-content">
                <h2>{t('guidePage.sectionTitle1')}</h2>
                <ol>
                    <li>{t('guidePage.step1')}<a href="https://mtc-riverside-database.web.app/" target="_blank" rel="noopener noreferrer">https://mtc-riverside-database.web.app/</a>.</li>
                    <img src={step1Image} height={300} alt="Step 1"/>
                    <li>{t('guidePage.step2')}</li>
                    <img src={step2Image} height={100} alt="Step 2"/>
                    <li>{t('guidePage.step3')}</li>
                    <img src={step3Image} height={300} alt="Step 3"/>
                    <li>{t('guidePage.step4')}</li>
                    <img src={step4aImage} height={300} alt="Step 4a"/>
                    <li>{t('guidePage.step5')}</li>
                    <img src={step4bImage} height={300} alt="Step 4b"/>
                    <li>{t('guidePage.step6')}</li>
                    <img src={step5Image} height={300} alt="Step 5"/>
                    <li>{t('guidePage.step7')}</li>
                    <img src={step6Image} height={300} alt="Step 6"/>
                    <li>{t('guidePage.step8')}</li>
                    <img src={step7Image} height={300} alt="Step 7"/>
                    <li>{t('guidePage.step9')}</li>
                    <img src={step8Image} height={300} alt="Step 8"/>
                    <li>{t('guidePage.step10')}</li>
                    <img src={step9Image} height={300} alt="Step 9"/>
                    <li>{t('guidePage.step11')}</li>
                    <img src={step10Image} height={300} alt="Step 10"/>
                </ol>
            </div>

            <button
                className="back-button"
                onClick={() => navigate('/')}
            >
                {t('guidePage.backToHome')}
            </button>
        </div>
    );
};

export default GuidePage;