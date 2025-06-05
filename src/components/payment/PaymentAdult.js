import React, { useState, useEffect } from 'react';
import './Payment.css';
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../../context/storageUtils';

const PaymentAdult = () => {
  removeFromLocalStorage('healthInfoFormData');
  removeFromLocalStorage('waiverFormData');
  removeFromLocalStorage('tnttRulesFormData');

  if (!getFromLocalStorage('currentPage'))
    window.location.href = '/';
  else if (getFromLocalStorage('currentPage') !== '/payment-adult')
    window.location.href = getFromLocalStorage('currentPage');

  // Danh sách các khoản phí
  const [feeItems] = useState([
    {
      id: 1,
      name: 'Tiền niên liễm (student supplies/materials/fees/incentives)',
      amount: 40,
      required: true // Bắt buộc
    },
    {
      id: 2,
      name: 'Áo đồng phục có logo',
      amount: 25,
      required: false // Tùy chọn
    },
    {
      id: 3,
      name: 'Skort đồng phục',
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

  const [confirmationCode, setConfirmationCode] = useState('');
  const [isValidCode, setIsValidCode] = useState(false);

  useEffect(() => {
    saveToLocalStorage('paymentFormData', quantities);
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

  // Kiểm tra mã xác nhận
  const handleCodeChange = (e) => {
    const code = e.target.value;
    setConfirmationCode(code);
    setIsValidCode(code === '1995');
  };

  return (
    <div className="payment-container">
      <h2>THANH TOÁN PHÍ SINH HOẠT</h2>

      <div className="payment-section">
        <h3>Danh sách các khoản phí</h3>
        <ul className="fee-list">
          {feeItems.map(item => (
            <li key={item.id} className="fee-item">
              <div className="fee-name">
                <span>
                  {item.name}
                  {item.required && <span className="required-badge"> (Bắt buộc)</span>}
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
          <span>Tổng cộng:</span>
          <span>${totalAmount}</span>
        </div>
      </div>

      {/* Phần QR code và xác nhận giữ nguyên như trước */}
      <div className="payment-section">
        <h3>Thanh toán qua Zelle</h3>
        <div className="qr-code-container">
          <div className="qr-code-placeholder">
            <p>QR Code Zelle</p>
            <p>(Vui lòng quét mã để thanh toán)</p>
          </div>
          <p className="zelle-email">tnttmethienchuariverside@gmail.com</p>
          <p className="payment-note">
            Sau khi thanh toán, xin vui lòng liên lạc Thư Ký hoặc Thủ Quỹ Đoàn qua số
            <br /><strong>714-873-3039</strong><br />
            nhắn với cú pháp (format) "(Tên) đã gửi Zelle đóng tiền và xin mã confirmation"
            <br />
            Thư Ký/Thủ Quỹ sẽ gửi lại mã xác nhận để nhập bên dưới
          </p>
        </div>
      </div>

      <div className="payment-section">
        <h3>Xác nhận thanh toán</h3>
        <div className="confirmation-input">
          <label htmlFor="confirmationCode">Mã xác nhận:</label>
          <input
            type="text"
            id="confirmationCode"
            value={confirmationCode}
            onChange={handleCodeChange}
            placeholder="Nhập mã bạn đã nhận"
          />
          <p className="instruction">(Mã xác nhận hợp lệ: copy dòng code từ tin nhắn)</p>
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          className={`submit-btn ${isValidCode ? '' : 'disabled'}`}
          disabled={!isValidCode}
          onClick={() => { 
            saveToLocalStorage('currentPage', '/health-info-adult')
            window.location.href = '/health-info-adult'; 
          }}
        >
          Hoàn tất đăng ký
        </button>
      </div>
    </div>
  );
};

export default PaymentAdult;