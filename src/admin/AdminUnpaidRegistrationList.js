// src/pages/AdminPage/AdminUnpaidRegistrationList.js
import React, { useState, useEffect } from 'react';
import { getUnpaidRegistrations, markRegistrationAsPaid } from '../context/firebaseFuncs';
import { useLanguage } from '../LanguageContext';
import './AdminPaidRegistrationList.css'; // Sử dụng lại CSS từ trang đã thanh toán

const AdminUnpaidRegistrationList = () => {
    const { translate: t } = useLanguage();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const nganhOrder = [
        "Ấu Nhi Dự Bị", "Ấu Nhi Cấp 1", "Ấu Nhi Cấp 2", "Ấu Nhi Cấp 3",
        "Thiếu Nhi Cấp 1", "Thiếu Nhi Cấp 2", "Thiếu Nhi Cấp 3",
        "Nghĩa Sĩ Cấp 1", "Nghĩa Sĩ Cấp 2", "Nghĩa Sĩ Cấp 3",
        "Hiệp Sĩ Cấp 1", "Hiệp Sĩ Cấp 2", "Hiệp Sĩ Trưởng Thành",
        "Huynh Trưởng", "Trợ Tá", "Huấn Luyện Viên"
    ];

    useEffect(() => {
        const fetchUnpaidRegistrations = async () => {
            setLoading(true);
            setError(null);
            try {
                const allData = await getUnpaidRegistrations();
                const sortedData = allData.sort((a, b) => {
                    const nganhA = a.registration?.nganh || '';
                    const nganhB = b.registration?.nganh || '';
                    return nganhOrder.indexOf(nganhA) - nganhOrder.indexOf(nganhB);
                });
                setRegistrations(sortedData);
            } catch (err) {
                console.error("Error fetching unpaid registrations:", err);
                setError("Không thể tải danh sách.");
            } finally {
                setLoading(false);
            }
        };
        fetchUnpaidRegistrations();
    }, []);

    const handleSendEmail = (reg) => {
        const name = `${reg.registration.ho} ${reg.registration.tenDem} ${reg.registration.tenGoi}`.trim();
        const emailAddress = reg.registration.email;
        const subject = encodeURIComponent(`Nhắc nhở: Hoàn tất ghi danh Thiếu Nhi Thánh Thể - Mã ID: ${reg.id}`);
        const body = encodeURIComponent(
            `Chào quý vị,\n\n` +
            `Đây là email nhắc nhở về việc hoàn tất ghi danh cho ${name}.\n\n` +
            `Hệ thống của chúng tôi cho thấy đơn ghi danh với mã ID **${reg.id}** vẫn chưa được thanh toán.\n` +
            `Theo hướng dẫn, quý vị có 1 tuần để hoàn tất việc đóng tiền. Nếu quá thời hạn, đơn ghi danh sẽ bị xóa và quý vị sẽ phải làm lại từ đầu.\n\n` +
            `Cách thức Thanh Toán xin vui lòng tham khảo tại: https://mtc-riverside-database.web.app/how-to-pay \n\n` + 
            `Để hoàn tất, xin vui lòng gửi tiền cho Ban Điều Hành. Sau khi thanh toán, quý vị vui lòng liên hệ với Ban Điều Hành để được xác nhận và nhận email thông báo chính thức.\n\n` +
            `Mọi thắc mắc, xin vui lòng liên hệ với Ban Điều Hành.\n\n` +
            `Xin chân thành cảm ơn.\n` +
            `Trân trọng,\n` +
            `Ban Điều Hành Thiếu Nhi Thánh Thể Đoàn Mẹ Thiên Chúa`
        );
        window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    };

    const handleMarkAsPaid = async (id) => {
        try {
            await markRegistrationAsPaid(id);
            // Xóa người dùng khỏi danh sách sau khi đã đánh dấu là đã trả tiền
            setRegistrations(prev => prev.filter(reg => reg.id !== id));
            alert("Đã cập nhật trạng thái thanh toán thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    if (loading) return <div className="loading-state">Đang tải danh sách...</div>;
    if (error) return <div className="error-state">Có lỗi xảy ra: {error}</div>;

    return (
        <div className="paid-list-container">
            <h1>Danh Sách Ghi Danh Chưa Thanh Toán</h1>
            
            {registrations.length === 0 ? (
                <div className="no-data">Không có đơn ghi danh nào chưa thanh toán.</div>
            ) : (
                <div className="paid-registration-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ Tên</th>
                                <th>Ngành</th>
                                <th>Ngày Sinh</th>
                                <th>Email</th>
                                <th>Điện Thoại</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map(reg => (
                                <tr key={reg.id}>
                                    <td>{reg.id}</td>
                                    <td>{[reg.registration.ho, reg.registration.tenDem, reg.registration.tenGoi].filter(Boolean).join(' ').trim()}</td>
                                    <td>{reg.registration.nganh}</td>
                                    <td>{reg.registration.ngaySinh}</td>
                                    <td>{reg.registration.email}</td>
                                    <td>{reg.registration.phoneCell}</td>
                                    <td className="actions-cell">
                                        <button 
                                            onClick={() => handleSendEmail(reg)}
                                            className="btn-action btn-email"
                                        >
                                            Gửi Email
                                        </button>
                                        <button 
                                            onClick={() => handleMarkAsPaid(reg.id)}
                                            className="btn-action btn-paid"
                                        >
                                            Đánh Dấu Đã Trả Tiền
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

export default AdminUnpaidRegistrationList;