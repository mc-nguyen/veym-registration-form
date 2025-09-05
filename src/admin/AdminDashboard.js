// src/pages/AdminPage/AdminDashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../context/firebaseFuncs";
import { signOut } from "firebase/auth";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("lastLoginTime");
      window.location.href = "/admin";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Đã xảy ra lỗi khi đăng xuất.");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h1>Trang Quản Trị Viên</h1>
      <p>Chào mừng bạn đến với bảng điều khiển Admin.</p>
      <div className="dashboard-options">
        <Link to="/admin/paid" className="dashboard-link">
          Quản lý Đơn Đã Thanh Toán
        </Link>
        <Link to="/admin/unpaid" className="dashboard-link">
          Quản lý Đơn Chưa Thanh Toán
        </Link>
        {/* Thêm nút mới ở đây */}
        <Link to="/admin/registrations" className="dashboard-link">
          Quản lý Tất Cả Các Đơn
        </Link>
        <Link to="/admin/parents" className="dashboard-link">
          Xem Danh Sách Phụ Huynh
        </Link>
        <Link to="/admin/contact-messages" className="dashboard-link">
          Quản lý Tin Nhắn Liên Hệ
        </Link>
        <Link to="/admin/notifications" className="dashboard-link">
          Thông Báo Thay Đổi/Cập Nhật
        </Link>
        <Link to="/admin/settings" className="dashboard-link">
          Cài Đặt
        </Link>
        <Link to="/admin/blacklist" className="dashboard-link">
          Quản lý Danh Sách Chặn
        </Link>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Đăng Xuất
      </button>
    </div>
  );
};

export default AdminDashboard;
