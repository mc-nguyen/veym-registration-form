// src/pages/PaidRegistrationsList/PaidRegistrationsList.js
import React, { useState, useEffect } from 'react';
import { getAllRegistrationsData } from '../context/firebaseFuncs';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import { useLanguage } from '../LanguageContext'; // Để hỗ trợ đa ngôn ngữ
import './AdminPaidRegistrationList.css'; // File CSS cho component này

const AdminPaidRegistrationList = () => {
    const { translate: t } = useLanguage();
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaidRegistrations = async () => {
            setLoading(true);
            setError(null);
            try {
                const allData = await getAllRegistrationsData();
                // Lọc chỉ những đơn đăng ký đã trả tiền
                const paidData = allData.filter(reg => reg.isPaid === true);
                setRegistrations(paidData);
            } catch (err) {
                console.error("Lỗi khi tải danh sách đăng ký đã trả tiền:", err);
                setError(t('paidRegistrationsList.fetchError') + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPaidRegistrations();
    }, [t]); // Chạy lại khi ngôn ngữ thay đổi

    const handleGeneratePdfClick = (registrationId, nganh) => {
        const allowedNganh = ["Hiệp Sĩ Trưởng Thành", "Huynh Trưởng", "Trợ Tá", "Huấn Luyện Viên"];

        if (allowedNganh.includes(nganh)) window.open(`/generate-pdf-adult/${registrationId}`, '_blank');
        else window.open(`/generate-pdf/${registrationId}`, '_blank');
    };

    const handleSendEmail = (reg) => {
        // Lấy các thông tin cần thiết từ đối tượng `reg`
        const fullName = `${reg.registration.tenGoi} ${reg.registration.tenDem} ${reg.registration.ho}`;
        const tenThanh = reg.registration.tenThanh;
        const nganh = reg.registration.nganh;
        const email = reg.registration.email;

        // Tạo nội dung email chi tiết và chuyên nghiệp
        const emailBody = `Chào ${tenThanh} ${fullName},

Đoàn TNTT Mẹ Thiên Chúa xin chân thành cảm ơn bạn đã đăng ký ghi danh.

Bạn đã đăng ký vào ngành: ${nganh}

Đây là giấy ghi danh của bạn. Vui lòng tải xuống và lưu giữ để tham khảo.
Xin bấm vào liên kết sau để xem chi tiết:

${window.location.origin}/generate-pdf/${reg.id}

Nếu bạn cần hỗ trợ, vui lòng liên hệ với ban tổ chức qua:
email - tnttmethienchuariverside@gmail.com
số điện thoại:
        - Tr. Quang: 909-543-5559
        - Tr. Vy: 714-873-3039
        - HSTT Thanh: 951-396-9396
        - HSTT Tina: 714-310-2250

Xin Chúa chúc lành cho bạn và gia đình.
Trân trọng,
Ban Điều Hành Đoàn Mẹ Thiên Chúa
Giáo Xứ Đức Mẹ Hằng Cứu Giúp - Riverside`;

        // Mã hóa nội dung để chèn vào URL
        const encodedBody = encodeURIComponent(emailBody);
        const subject = encodeURIComponent(`Giấy ghi danh TNTT của ${fullName}`);

        // // Mở ứng dụng email mặc định của người dùng với nội dung chi tiết
        // window.location.href = `mailto:${email}?subject=${subject}&body=${encodedBody}`;
        // Tạo URL để mở trang soạn thảo email trên Gmail
        const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${email}&su=${subject}&body=${encodedBody}`;

        // Mở URL này trong một tab mới
        window.open(gmailUrl, '_blank');
    };

    if (loading) {
        return <div className="paid-list-container"><p>{t('paidRegistrationsList.loading')}</p></div>;
    }

    if (error) {
        return <div className="paid-list-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="paid-list-container">
            <h1>{t('paidRegistrationsList.title')}</h1>

            {registrations.length === 0 ? (
                <p>{t('paidRegistrationsList.noRegistrations')}</p>
            ) : (
                <div className="paid-registration-table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Họ Tên</th>
                                <th>Ngành</th>
                                <th>Ngày Sinh</th>
                                <th>Email</th>
                                <th>SĐT CĐ</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((reg) => (
                                <tr key={reg.id}>
                                    <td>{[reg.registration.tenGoi, reg.registration.tenDem, reg.registration.ho].filter(Boolean).join(' ').trim()}</td>
                                    <td>{reg.registration.nganh}</td>
                                    <td>{reg.registration.ngaySinh}</td>
                                    <td>{reg.registration.email}</td>
                                    <td>{reg.registration.phoneCell}</td>
                                    <td className="actions-cell">
                                        <button
                                            onClick={() => handleGeneratePdfClick(reg.id, reg.registration.nganh)}
                                            className="btn-generate-pdf"
                                        >
                                            {t('paidRegistrationsList.generatePdfButton')}
                                        </button>
                                        <button
                                            onClick={() => handleSendEmail(reg)}
                                            className="btn-send-email"
                                        >
                                            Email
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

export default AdminPaidRegistrationList;