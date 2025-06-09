// Example in App.js or a separate LanguageSwitcher component
import React from 'react';
import { useLanguage } from '../LanguageContext';

function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  const handleLanguageChange = (e) => {
    changeLanguage(e.target.value);
  };

  return (
    <div style={{ margin: '10px' }}>
      <label htmlFor="language-select">Chọn ngôn ngữ (Choose your language):</label>
      <select id="language-select" value={language} onChange={handleLanguageChange}>
        <option value="vi">Tiếng Việt</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}

export default LanguageSwitcher;