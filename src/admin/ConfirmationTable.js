import React, { useState, useEffect } from 'react';
import './ConfirmationTable.css'; // File CSS cho bảng
import { getAllConfirmations } from '../context/firebaseFuncs';

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

  if (loading) {
    return <div className="loading-message">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (confirmations.length === 0) {
    return <div className="no-data-message">Không có dữ liệu xác nhận nào được tìm thấy.</div>;
  }

  return (
    <div className="confirmation-table-container">
      <h1>Danh Sách Mã Xác Nhận</h1>
      <table className="confirmation-table">
        <thead>
          <tr>
            <th>ID Tài Liệu</th>
            <th>Mã Xác Nhận</th>
          </tr>
        </thead>
        <tbody>
          {confirmations.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.confirmation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ConfirmationTable;