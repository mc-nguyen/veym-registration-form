// src/pages/PaidRegistrationsList/PaidRegistrationsList.js
import React, { useState, useEffect } from 'react';
import { getAllRegistrationsData } from '../context/firebaseFuncs';
import { useLanguage } from '../LanguageContext';
import './AdminPaidRegistrationList.css';

const AdminPaidRegistrationList = () => {
    const { translate: t } = useLanguage();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Predefined order for 'nganh' (sector)
    const nganhOrder = [
        "Ấu Nhi Dự Bị", "Ấu Nhi Cấp 1", "Ấu Nhi Cấp 2", "Ấu Nhi Cấp 3",
        "Thiếu Nhi Cấp 1", "Thiếu Nhi Cấp 2", "Thiếu Nhi Cấp 3",
        "Nghĩa Sĩ Cấp 1", "Nghĩa Sĩ Cấp 2", "Nghĩa Sĩ Cấp 3",
        "Hiệp Sĩ Cấp 1", "Hiệp Sĩ Cấp 2", "Hiệp Sĩ Trưởng Thành",
        "Huynh Trưởng", "Trợ Tá", "Huấn Luyện Viên"
    ];

    useEffect(() => {
        const fetchPaidRegistrations = async () => {
            setLoading(true);
            setError(null);
            try {
                const allData = await getAllRegistrationsData();
                const paidData = allData.filter(reg => reg.isPaid === true);

                // Sort the paidData array
                const sortedData = paidData.sort((a, b) => {
                    const nganhA = a.registration.nganh;
                    const nganhB = b.registration.nganh;
                    const tenGoiA = a.registration.tenGoi.toLowerCase();
                    const tenGoiB = b.registration.tenGoi.toLowerCase();

                    // First, sort by 'nganh' using the predefined order
                    const nganhIndexA = nganhOrder.indexOf(nganhA);
                    const nganhIndexB = nganhOrder.indexOf(nganhB);

                    if (nganhIndexA !== nganhIndexB) {
                        return nganhIndexA - nganhIndexB;
                    }

                    // If 'nganh' is the same, sort alphabetically by 'tenGoi'
                    if (tenGoiA < tenGoiB) {
                        return -1;
                    }
                    if (tenGoiA > tenGoiB) {
                        return 1;
                    }
                    return 0; // names are equal
                });

                setRegistrations(sortedData);
            } catch (err) {
                console.error("Lỗi khi tải danh sách đăng ký đã trả tiền:", err);
                setError(t('paidRegistrationsList.fetchError') + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPaidRegistrations();
    }, [t]);

    const handleDownloadCSV = () => {
        const header = [
            "Tên Thánh", "Họ", "Tên Đệm", "Tên Gọi", "Ngày Sinh", "Ngành",
            "Tên Cha", "Tên Mẹ", "SĐT Cha", "SĐT Mẹ", "Email"
        ];

        const csvRows = registrations.map(reg => {
            const data = reg.registration || {};
            return [
                data.tenThanh || '',
                data.ho || '',
                data.tenDem || '',
                data.tenGoi || '',
                data.ngaySinh || '',
                data.nganh || '',
                data.tenCha || '',
                data.tenMe || '',
                data.phoneCha || '',
                data.phoneMe || '',
                data.email || ''
            ].map(item => `"${item}"`).join(',');
        });

        // Thêm BOM vào đầu nội dung CSV
        const csvContent = "\uFEFF" + [
            header.join(','),
            ...csvRows
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'danh_sach_ghi_danh.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleGeneratePdfClick = (registrationId, nganh) => {
        const allowedNganh = ["Hiệp Sĩ Trưởng Thành", "Huynh Trưởng", "Trợ Tá", "Huấn Luyện Viên"];

        if (allowedNganh.includes(nganh)) window.open(`/generate-pdf-adult/${registrationId}`, '_blank');
        else window.open(`/generate-pdf/${registrationId}`, '_blank');
    };

    const handleSendEmail = (reg) => {
        const fullName = `${reg.registration.tenGoi} ${reg.registration.tenDem} ${reg.registration.ho}`;
        const tenThanh = reg.registration.tenThanh;
        const nganh = reg.registration.nganh;
        const email = reg.registration.email;

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

        const encodedBody = encodeURIComponent(emailBody);
        const subject = encodeURIComponent(`Giấy ghi danh TNTT của ${fullName}`);

        const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${email}&su=${subject}&body=${encodedBody}`;

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
                                    <td>{[reg.registration.ho, reg.registration.tenDem, reg.registration.tenGoi].filter(Boolean).join(' ').trim()}</td>
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

            <button
                onClick={handleDownloadCSV}
                className="btn-download-csv"
                style={{ marginBottom: '20px' }}
            >
                Tải xuống CSV
            </button>
        </div>
    );
};

export default AdminPaidRegistrationList;