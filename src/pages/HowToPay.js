import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HowToPay.css';
import { useLanguage } from '../LanguageContext'; // Import useLanguage hook
import zelle from '../assets/zelle.png'; // Đường dẫn đến logo của bạn

const HowToPay = () => {
  const { translate: t } = useLanguage(); // Lấy hàm translate từ hook
  const navigate = useNavigate();

  return (
    <div className="payment-container">
      <h2>{t('howToPay.title')}</h2>

      {/* Phần QR code và xác nhận giữ nguyên như trước */}
      <div className="payment-section">
        <h3>{t('howToPay.zellePaymentTitle')}</h3>
        <div className="qr-code-container">
          <img src={zelle} alt="Zelle" className="zelle-logo" />
          <p className="zelle-email">{t('howToPay.zelleEmail')}<br />tnttmethienchuariverside@gmail.com</p>
          <p className="payment-note">
            {t('howToPay.paymentNote1')}
            <br /><strong>
              714-873-3039 - Trưởng Quang Vy (Marvin Calvin) - Thư Ký/Secretary<br />
              951-396-9396 - Trưởng Thanh Paula <br />
              714-310-2250 - Trưởng Tina - Thủ Quỹ/Treasurer
            </strong><br />
          </p>
        </div>
      </div>

      <div className="payment-section">
        <h3>{t('howToPay.cashPaymentTitle')}</h3>
        <ul>
          <li>{t('howToPay.paymentNoteA')}</li>
          <li>{t('howToPay.paymentNoteB')}</li>
          <li>{t('howToPay.paymentNoteC')}</li>
        </ul>
      </div>

      <div className="payment-section">
        <h3>{t('howToPay.checkPaymentTitle')}</h3>
        <ul>
          <li>{t('howToPay.paymentNoteD')} <strong>VEYM - Me Thien Chua Chapter</strong></li>
          <li>{t('howToPay.paymentNoteE')}</li>
          <li>{t('howToPay.paymentNoteA')}</li>
          <li>{t('howToPay.paymentNoteB')}</li>
          <li>{t('howToPay.paymentNoteC')}</li>
        </ul>
      </div>

      <div className="navigation-buttons">
        <button
          className="submit-btn"
          onClick={() => navigate('/')}
        >
          {t('howToPay.returnToHome')}
        </button>
      </div>
    </div>
  );
};

export default HowToPay;