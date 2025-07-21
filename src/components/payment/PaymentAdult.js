import React, { useState, useEffect } from 'react';
import './Payment.css';
import { saveToLocalStorage, getFromLocalStorage } from '../../context/storageUtils';
import { savePaymentToFirebase } from '../../context/firebaseFuncs';
import { useLanguage } from '../../LanguageContext'; // Import useLanguage hook
import zelle from '../../assets/zelle.png'; // Đường dẫn đến logo của bạn

const Payment = () => {
  const { translate: t } = useLanguage(); // Lấy hàm translate từ hook

  // Danh sách các khoản phí
  const [feeItems] = useState([
    {
      id: 1,
      name: t('paymentPage.feeItems.annualFee'), // Dịch tên khoản phí
      amount: 50,
      required: true // Bắt buộc
    },
    {
      id: 2,
      name: t('paymentPage.feeItems.uniformShirt'), // Dịch tên khoản phí
      amount: 25,
      required: false // Tùy chọn
    },
    {
      id: 3,
      name: t('paymentPage.feeItems.uniformSkort'), // Dịch tên khoản phí
      amount: 25,
      required: false // Tùy chọn
    }
  ]);

  // State cho số lượng mỗi loại (mặc định 0 cho các mục không bắt buộc)
  const [quantities, setQuantities] = useState(() => {
    const savedData = getFromLocalStorage('paymentFormData') || {
      1: 1,
      2: 0,
      3: 0
    };
    return savedData;
  });

  useEffect(() => {
    saveToLocalStorage('paymentFormData', quantities);
    savePaymentToFirebase(getFromLocalStorage('id'), quantities);
  }, [quantities]);

  // Cập nhật số lượng
  const handleQuantityChange = (id, value) => {
    const newValue = Math.max(0, parseInt(value) || 0); // Cho phép giá trị 0
    setQuantities(prev => ({
      ...prev,
      [id]: newValue
    }));
  };

  // Tính tổng tiền
  const calculateTotal = () => {
    return feeItems.reduce((sum, item) => {
      const qty = quantities[item.id] || 0;
      return sum + (item.amount * qty);
    }, 0);
  };

  const totalAmount = calculateTotal();

  const handleSubmit = async () => {
    saveToLocalStorage('currentPage', '/health-info-adult');
    window.location.href = '/health-info-adult';
  }

  return (
    <div className="payment-container">
      <h2>{t('paymentPage.title')}</h2>

      <div className="payment-section">
        <h3>{t('paymentPage.feeListTitle')}</h3>
        <ul className="fee-list">
          {feeItems.map(item => (
            <li key={item.id} className="fee-item">
              <div className="fee-name">
                <span>
                  {item.name}
                  {item.required && <span className="required-badge"> {t('paymentPage.requiredBadge')}</span>}
                </span>
                <input
                  type="number"
                  min={item.required ? 1 : 0}
                  value={quantities[item.id] || 0}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="quantity-input"
                  disabled={item.required}
                />
              </div>
              <span className="fee-amount">
                ${item.amount} {quantities[item.id] > 0 && `× ${quantities[item.id]}`}
              </span>
            </li>
          ))}
        </ul>

        <div className="total-amount">
          <span>{t('paymentPage.totalAmount')}</span>
          <span>${totalAmount}</span>
        </div>
      </div>

      {/* Phần QR code và xác nhận giữ nguyên như trước */}
      <div className="payment-section">
        <h3>{t('paymentPage.zellePaymentTitle')}</h3>
        <div className="qr-code-container">
          <img src={zelle} alt="Zelle" className="zelle-logo" />
          <p className="zelle-email">{t('paymentPage.zelleEmail')}<br />tnttmethienchuariverside@gmail.com</p>
          <p className="payment-note">
            {t('paymentPage.paymentNote1')}
            <br /><strong>
              714-873-3039 - Trưởng Quang Vy (Marvin Calvin) - Thư Ký/Secretary<br />
              951-396-9396 - Trưởng Thanh Paula <br />
              714-310-2250 - Trưởng Tina - Thủ Quỹ/Treasurer
            </strong><br />
          </p>
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          className="submit-btn"
          onClick={handleSubmit}
        >
          {t('paymentPage.completeRegistrationButton')}
        </button>
      </div>
    </div>
  );
};

export default Payment;