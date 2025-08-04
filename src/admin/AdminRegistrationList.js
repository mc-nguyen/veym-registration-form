// src/pages/AdminPage/AdminRegistrationList.js
import React, { useState, useEffect } from 'react';
import { getAllRegistrationsData, updatePaymentStatus, deleteRegistration } from '../context/firebaseFuncs';
import './AdminRegistrationList.css'; // Tạo file CSS riêng cho component này

const AdminRegistrationList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterPaid, setFilterPaid] = useState(true); // Mặc định hiển thị đã trả tiền

    useEffect(() => {
        fetchRegistrations();
    }, [filterPaid]); // Fetch lại khi bộ lọc thay đổi

    const fetchRegistrations = async () => {
        setLoading(true);
        setError(null);
        try {
            const allData = await getAllRegistrationsData();
            // Lọc theo trạng thái thanh toán
            const filteredData = allData.filter(reg => reg.isPaid === filterPaid);
            setRegistrations(filteredData);
        } catch (err) {
            console.error("Error fetching registrations:", err);
            setError("Failed to load registrations. " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePaidStatus = async (id, currentStatus) => {
        if (window.confirm(`Bạn có chắc muốn chuyển trạng thái thanh toán của ${id} thành ${currentStatus ? 'Chưa trả' : 'Đã trả'} không?`)) {
            try {
                await updatePaymentStatus(id, !currentStatus);
                alert("Cập nhật trạng thái thanh toán thành công!");
                fetchRegistrations(); // Tải lại danh sách
            } catch (err) {
                console.error("Error updating payment status:", err);
                alert("Lỗi khi cập nhật trạng thái thanh toán: " + err.message);
            }
        }
    };

    const handleDeleteRegistration = async (id, parentSignatureUrl, studentSignatureUrl) => {
        if (window.confirm("Bạn có chắc muốn xóa đơn đăng ký này? Thao tác này không thể hoàn tác.")) {
            try {
                await deleteRegistration(id, parentSignatureUrl, studentSignatureUrl);
                alert("Đơn đăng ký đã được xóa thành công!");
                fetchRegistrations(); // Tải lại danh sách
            } catch (err) {
                console.error("Error deleting registration:", err);
                alert("Lỗi khi xóa đơn đăng ký: " + err.message);
            }
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
    };

    return (
        <div className="admin-list-container">
            <h1>Danh Sách Đăng Ký</h1>

            <div className="filter-controls">
                <label>
                    <input
                        type="radio"
                        name="paymentFilter"
                        value="paid"
                        checked={filterPaid === true}
                        onChange={() => setFilterPaid(true)}
                    />
                    Đã trả tiền
                </label>
                <label>
                    <input
                        type="radio"
                        name="paymentFilter"
                        value="unpaid"
                        checked={filterPaid === false}
                        onChange={() => setFilterPaid(false)}
                    />
                    Chưa trả tiền
                </label>
            </div>

            {loading && <p>Đang tải dữ liệu đăng ký...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && registrations.length === 0 && (
                <p>Không có đơn đăng ký nào với trạng thái "{filterPaid ? 'Đã trả tiền' : 'Chưa trả tiền'}".</p>
            )}

            {!loading && registrations.length > 0 && (
                <div className="registration-table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ Tên</th>
                                <th>Ngành</th>
                                <th>Ngày Sinh</th>
                                <th>Email</th>
                                <th>SĐT CĐ</th>
                                <th>SĐT NT</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((reg) => (
                                <tr key={reg.id}>
                                    <td>{reg.id}</td>
<<<<<<< HEAD
                                    <td>{[reg.registration.tenGoi, reg.registration.tenDem, reg.registration.ho].filter(Boolean).join(' ').trim()}</td>
                                    <td>{reg.registration.nganh}</td>
                                    <td>{reg.registration.ngaySinh}</td>
                                    <td>{reg.registration.email}</td>
                                    <td>{reg.registration.phoneCell}</td>
                                    <td>{reg.registration.phoneHome}</td>
=======
                                    <td>{[reg.tenGoi, reg.tenDem, reg.ho].filter(Boolean).join(' ').trim()}</td>
                                    <td>{reg.nganh}</td>
                                    <td>{reg.ngaySinh}</td>
                                    <td>{reg.email}</td>
                                    <td>{reg.phoneCell}</td>
                                    <td>{reg.phoneHome}</td>
>>>>>>> a6df68639482dd4e5c1bc13043c11e5925c213ca
                                    <td>{reg.isPaid ? 'Đã trả' : 'Chưa trả'}</td>
                                    <td>{formatTimestamp(reg.timestamp)}</td>
                                    <td className="actions-cell">
                                        <button
                                            onClick={() => handleTogglePaidStatus(reg.id, reg.isPaid)}
                                            className={reg.isPaid ? 'btn-unpaid' : 'btn-paid'}
                                        >
                                            {reg.isPaid ? 'Chuyển chưa trả' : 'Chuyển đã trả'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRegistration(reg.id, reg.parentSignature, reg.studentSignature)}
                                            className="btn-delete"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminRegistrationList;