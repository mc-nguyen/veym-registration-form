import React, { useState, useEffect } from 'react';
import './Payment.css';
import { saveToLocalStorage, getFromLocalStorage } from '../../context/storageUtils';
import { savePaymentToFirebase } from '../../context/firebaseFuncs';
import useFirebaseSettings from '../../context/useFirebaseSettings';
import { useLanguage } from '../../LanguageContext'; // Import useLanguage hook
import zelle from '../../assets/zelle.png'; // Đường dẫn đến logo của bạn

const Payment = () => {
  const { translate: t } = useLanguage(); // Lấy hàm translate từ hook
  // const { prices, committee, spiritualDirectorName, leaderName, leaderPhone, loading, error } = useFirebaseSettings();
  const settings = useFirebaseSettings();
  const prices = settings.prices;
  const committee = settings.committee;
  const loading = settings.loading;
  const error = settings.error;

  // Danh sách các khoản phí
  const [feeItems, setFeeItems] = useState([
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
    },
    {
      id: 4,
      name: t('paymentPage.feeItems.tnttScarf'), // Dịch tên khoản phí
      amount: 10,
      required: false // Tùy chọn
    }
  ]);

  // State cho số lượng mỗi loại (mặc định 0 cho các mục không bắt buộc)
  const [quantities, setQuantities] = useState(() => {
    const savedData = getFromLocalStorage('paymentFormData') || {
      1: 1,
      2: 0,
      3: 0,
      4: 0
    };
    return savedData;
  });

  useEffect(() => {
    if (prices.length > 0) {
      // Gán các giá trị từ prices vào feeItems
      const items = prices.map(p => {
        let nameKey = '';
        let required = false;
        if (p.name === 'Niên liễm') {
          nameKey = 'annualFee';
          required = true;
        } else if (p.name === 'Đồng phục') {
          nameKey = 'uniformShirt';
        } else if (p.name === 'Váy') {
          nameKey = 'uniformSkort';
        } else if (p.name === 'Khăn') {
          nameKey = 'tnttScarf';
        }
        return {
          id: p.id,
          name: t(`paymentPage.feeItems.${nameKey}`),
          amount: p.amount,
          required: required
        };
      });
      setFeeItems(items);

      // Thiết lập số lượng mặc định, đặc biệt cho mục bắt buộc
      const savedData = getFromLocalStorage('paymentFormData') || {};
      const initialQuantities = { ...savedData };
      items.forEach(item => {
        if (item.required && (initialQuantities[item.id] === undefined || initialQuantities[item.id] === 0)) {
          initialQuantities[item.id] = 1;
        }
      });
      setQuantities(initialQuantities);
    }
  }, [prices, t]);

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
    await savePaymentToFirebase(getFromLocalStorage('id'), quantities);
    if (getFromLocalStorage('complete')) window.location.href = '/complete';
    else window.location.href = '/processing';
  }

  if (loading) return <div>Đang tải thông tin phí...</div>;
  if (error) return <div>Có lỗi xảy ra: {error}</div>;

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
              {committee.map((member, index) => (
                <div key={index}>{member.phone} - {member.name}</div>
              ))}
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