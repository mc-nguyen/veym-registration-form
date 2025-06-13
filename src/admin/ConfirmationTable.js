import React, { useState, useEffect } from 'react';
import './ConfirmationTable.css'; // File CSS cho bảng
import { generateRandomConfirmationCode, getAllConfirmations, giveConfirmation } from '../context/firebaseFuncs';

function ConfirmationTable() {
  const [confirmations, setConfirmations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfirmations = async () => {
      try {
        const data = await getAllConfirmations();
        setConfirmations(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch confirmations:", err);
        setError("Không thể tải dữ liệu xác nhận. Vui lòng thử lại.");
        setLoading(false);
      }
    };

    fetchConfirmations();
  }); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần khi component mount

  const handleGenerateCodes = async () => {
    const codesToGenerate = 20;
    for (let i = 0; i < codesToGenerate; i++)
      await generateRandomConfirmationCode();
  };

  if (loading) {
    return <div className="loading-message">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (confirmations.length === 0) {
    return <div className="no-data-message">
      Không có dữ liệu xác nhận nào được tìm thấy.
      <button className="generate-button" onClick={handleGenerateCodes}>
        Tạo 20 Mã Xác Nhận Mới
      </button>
    </div>;
  }

  return (
    <div className="confirmation-table-container">
      <h1>Danh Sách Mã Xác Nhận</h1>
      <table className="confirmation-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Mã Xác Nhận</th>
            <th>Đưa ra</th>
            <th>Sử dụng</th>
            <th>Lệnh</th>
          </tr>
        </thead>
        <tbody>
          {confirmations.map((item, key) => (
            <tr key={item.id}>
              <td>{key + 1}</td>
              <td>{item.confirmation}</td>
              <td className="status-cell">
                {item.given ? <span className="status-icon status-true">&#10003;</span> : <span className="status-icon status-false">&#10007;</span>}
              </td>
              <td className="status-cell">
                {item.used ? <span className="status-icon status-true">&#10003;</span> : <span className="status-icon status-false">&#10007;</span>}
              </td>
              <td> {/* Cột cho nút "Đưa ra" */}
                  {!item.given && !item.used && ( // Chỉ hiển thị nút nếu chưa được đưa ra và chưa được sử dụng
                    <button
                      className="action-button give-button"
                      onClick={() => giveConfirmation(item.confirmation)}
                      disabled={item.used} // Vô hiệu hóa nếu đã được sử dụng
                    >
                      Đưa ra
                    </button>
                  )}
                  {item.given && !item.used && ( // Hiển thị nút "Hủy đưa ra" nếu đã đưa ra nhưng chưa sử dụng
                     <button
                        className="action-button revoke-button"
                        onClick={() => giveConfirmation(item.confirmation)}
                        disabled={item.used}
                    >
                        Hủy đưa ra
                    </button>
                  )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="generate-button" onClick={handleGenerateCodes}>
        Tạo 20 Mã Xác Nhận Mới
      </button>
    </div>
  );
}

export default ConfirmationTable;