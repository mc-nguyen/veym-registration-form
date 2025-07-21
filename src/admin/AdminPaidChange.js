// src/pages/AdminPage/AdminPaidChange.js
import React, { useState, useEffect } from 'react';
import { getAllRegistrations, updateRegistrationData, updatePaymentStatus, deleteRegistration } from '../context/firebaseFuncs'; // Cập nhật import
import './AdminPaidChange.css'; // File CSS cho trang admin

const AdminPaidChange = () => {
    const [unpaidRegistrations, setUnpaidRegistrations] = useState([]);
    const [paidRegistrations, setPaidRegistrations] = useState([]);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [editingData, setEditingData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAndCategorizeRegistrations();
    }, []);

    // Hàm để lấy và phân loại các đơn đăng ký
    const fetchAndCategorizeRegistrations = async () => {
        setLoading(true);
        setError(null);
        try {
            const allData = await getAllRegistrations();
            const unpaid = allData.filter(reg => !reg.isPaid);
            const paid = allData.filter(reg => reg.isPaid);
            setUnpaidRegistrations(unpaid);
            setPaidRegistrations(paid);
        } catch (err) {
            console.error("Error fetching and categorizing registrations:", err);
            setError("Failed to load registrations.");
        } finally {
            setLoading(false);
        }
    };

    // Hàm chọn một đơn để xem/chỉnh sửa
    const handleSelectRegistration = (registration) => {
        setSelectedRegistration(registration);
        setEditingData(registration); // Khởi tạo dữ liệu chỉnh sửa với dữ liệu hiện tại
    };

    // Hàm xử lý thay đổi trong form chỉnh sửa (cho các trường khác ngoài trạng thái thanh toán)
    const handleChangeEditingData = (e) => {
        const { name, value } = e.target;
        setEditingData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Hàm lưu các thay đổi vào Firebase (cho các trường khác ngoài trạng thái thanh toán)
    const handleSaveChanges = async () => {
        if (!selectedRegistration || !selectedRegistration.id) {
            alert("No registration selected or ID is missing.");
            return;
        }

        try {
            await updateRegistrationData(selectedRegistration.id, editingData);
            alert("Changes saved successfully!");
            setSelectedRegistration(null);
            fetchAndCategorizeRegistrations(); // Tải lại danh sách để thấy thay đổi
        } catch (err) {
            console.error("Error saving changes:", err);
            setError("Failed to save changes.");
        }
    };

    // Hàm hủy bỏ chỉnh sửa
    const handleCancelEdit = () => {
        setSelectedRegistration(null);
        setEditingData({});
    };

    // Hàm thay đổi trạng thái thanh toán
    const handleChangePaymentStatus = async (id, currentStatus) => {
        const newStatus = !currentStatus; // Đảo ngược trạng thái
        try {
            await updatePaymentStatus(id, newStatus);
            alert(`Payment status updated to ${newStatus ? 'Paid' : 'Unpaid'}!`);
            fetchAndCategorizeRegistrations(); // Tải lại danh sách để cập nhật các bảng
        } catch (err) {
            console.error("Error changing payment status:", err);
            setError("Failed to update payment status.");
        }
    };

    // Hàm xóa một đơn
    const handleDeleteRegistration = async (id, signatureUrl) => {
        if (window.confirm("Are you sure you want to delete this registration? This action cannot be undone.")) {
            try {
                await deleteRegistration(id, signatureUrl); // Truyền signatureUrl nếu bạn muốn xóa chữ ký
                alert("Registration deleted successfully!");
                fetchAndCategorizeRegistrations();
            } catch (err) {
                console.error("Error deleting registration:", err);
                setError("Failed to delete registration.");
            }
        }
    };

    return (
        <div className="admin-page-container">
            <h1>Admin Dashboard</h1>

            {loading && <p>Loading registrations...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="registration-sections">
                {/* Bảng cho các đơn CHƯA trả tiền */}
                <div className="registration-list unpaid-list">
                    <h2>Unpaid Registrations ({unpaidRegistrations.length})</h2>
                    {unpaidRegistrations.length === 0 && !loading && <p>No unpaid registrations found.</p>}
                    <ul>
                        {unpaidRegistrations.map(reg => (
                            <li key={reg.id} className="registration-item">
                                <span>{reg.id}</span>
                                <div className="item-actions">
                                    <button onClick={() => handleSelectRegistration(reg)}>Edit</button>
                                    <button onClick={() => handleChangePaymentStatus(reg.id, reg.isPaid)} className="status-toggle-btn mark-paid">Mark as Paid</button>
                                    <button onClick={() => handleDeleteRegistration(reg.id, reg.signature)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Bảng cho các đơn ĐÃ trả tiền */}
                <div className="registration-list paid-list">
                    <h2>Paid Registrations ({paidRegistrations.length})</h2>
                    {paidRegistrations.length === 0 && !loading && <p>No paid registrations found.</p>}
                    <ul>
                        {paidRegistrations.map(reg => (
                            <li key={reg.id} className="registration-item">
                                <span>{reg.id}</span>
                                <div className="item-actions">
                                    <button onClick={() => handleSelectRegistration(reg)}>Edit</button>
                                    <button onClick={() => handleChangePaymentStatus(reg.id, reg.isPaid)} className="status-toggle-btn mark-unpaid">Mark as Unpaid</button>
                                    <button onClick={() => handleDeleteRegistration(reg.id, reg.signature)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>


            {selectedRegistration && (
                <div className="edit-form-container">
                    <h2>Edit Registration: {selectedRegistration.fullName}</h2>
                    <form>
                        {/* Ví dụ về một vài trường bạn có thể chỉnh sửa */}
                        <div className="form-group">
                            <label>Saint Name:</label>
                            <input
                                type="text"
                                name="tenThanh"
                                value={editingData.tenThanh || ''}
                                onChange={handleChangeEditingData}
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name:</label>
                            <input
                                type="text"
                                name="ho"
                                value={editingData.ho || ''}
                                onChange={handleChangeEditingData}
                            />
                        </div>
                        <div className="form-group">
                            <label>First Name (Ten Goi):</label>
                            <input
                                type="text"
                                name="tenGoi"
                                value={editingData.tenGoi || ''}
                                onChange={handleChangeEditingData}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={editingData.email || ''}
                                onChange={handleChangeEditingData}
                            />
                        </div>
                        <div className="form-group">
                            <label>Birth Date (YYYY-MM-DD):</label>
                            <input
                                type="date"
                                name="ngaySinh"
                                value={editingData.ngaySinh || ''}
                                onChange={handleChangeEditingData}
                            />
                        </div>
                        <div className="form-group">
                            <label>Branch (Nganh):</label>
                            <input
                                type="text"
                                name="nganh"
                                value={editingData.nganh || ''}
                                onChange={handleChangeEditingData}
                            />
                        </div>
                        {/* Thêm các trường khác cần chỉnh sửa tại đây */}

                        <div className="form-actions">
                            <button type="button" onClick={handleSaveChanges}>Save Changes</button>
                            <button type="button" onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminPaidChange;