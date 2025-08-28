// src/components/NotificationsPage.js
import React, { useState, useEffect } from 'react';
import { getNotifications } from '../context/firebaseFuncs'; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import './AdminNotificationsPage.css';

function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Nếu người dùng đã đăng nhập, tải dữ liệu thông báo
        try {
          const data = await getNotifications();
          setNotifications(data);
        } catch (e) {
          setError("Không thể tải dữ liệu thông báo.");
          console.error("Lỗi khi tải thông báo:", e);
        } finally {
          setLoading(false);
        }
      } else {
        // Nếu người dùng chưa đăng nhập, chuyển hướng về trang đăng nhập
        console.log("Người dùng chưa đăng nhập. Chuyển hướng...");
        navigate('/admin-login'); // Thay đổi đường dẫn nếu cần
      }
    });

    // Clean-up function
    return () => unsubscribe();
  }, [auth, navigate]);

  const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const year = date.getFullYear();
      return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  if (loading) return <div className="loading-state">Đang tải thông báo...</div>;
  if (error) return <div className="error-state">Có lỗi xảy ra: {error}</div>;

  return (
    <div className="admin-container">
      <h1>Danh Sách Thông Báo</h1>
      
      {notifications.length === 0 ? (
        <div className="no-data">Không có thông báo nào.</div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Thời gian</th>
                <th>ID</th>
                <th>Nội dung</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(noti => (
                <tr key={noti.id}>
                  <td>{formatTimestamp(noti.timestamp)}</td>
                  <td>{noti.id}</td>
                  <td>{noti.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminNotificationsPage;