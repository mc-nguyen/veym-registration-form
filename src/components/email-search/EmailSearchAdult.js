// src/components/EmailSearch.js (hoặc src/App.js)

import React, { useState } from 'react';
import './EmailSearch.css'; // Giữ nguyên file CSS đã tạo trước đó
import { useLanguage } from '../../LanguageContext'; // Import useLanguage hook
import { getDataByEmail, getDataById } from '../../context/firebaseFuncs';
import { saveToLocalStorage } from '../../context/storageUtils';

function EmailSearchAdult() {
    const { translate: t } = useLanguage();

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success', 'error', 'warning', 'info'
    const [tableData, setTableData] = useState([]); // Đổi tên state để rõ ràng hơn, tránh trùng với biến 'data' cục bộ

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSearch = async () => {
        setTableData([]); // Clear previous table data before a new search
        if (email.trim() === '') {
            setMessage(t('searchEmail.message_enter_email_or_skip'));
            setMessageType('warning');
        } else if (!isValidEmail(email)) {
            setMessage(t('searchEmail.message_invalid_email'));
            setMessageType('error');
        } else {
            setMessage(t('searchEmail.message_searching_for_email', { email }));
            setMessageType('info'); // Set to info while searching

            const emailData = await getDataByEmail(email); // Lấy data từ email

            if (emailData) {
                const stringIds = Object.values(emailData).filter(value => typeof value === 'string'); // Lọc lấy các ID là string

                const rows = [];
                for (const [key, id] of stringIds.entries()) { // Dùng for...of để await bên trong loop
                    const individualData = await getDataById(id); // AWAIT this call
                    const registrationData = individualData.registration;
                    const forParent = [
                        "Hiệp Sĩ Trưởng Thành",
                        "Huynh Trưởng",
                        "Trợ Tá",
                        "Huấn Luyện Viên"
                    ]
                    console.log(forParent.includes(registrationData.nganh));

                    if (registrationData && forParent.includes(registrationData.nganh)) {
                        rows.push(
                            <tr key={id}> {/* Thêm key để React render danh sách hiệu quả hơn */}
                                <td>{key + 1}</td> {/* key là index, cộng 1 để bắt đầu từ 1 */}
                                <td>{id}</td>
                                <td>{`${registrationData.tenThanh ? registrationData.tenThanh + ' - ' : ''}${registrationData.ho || ''} ${registrationData.tenDem || ''} ${registrationData.tenGoi || ''}`}</td>
                                <td>{registrationData.ngaySinh || ''}</td>
                                <td>
                                    <button
                                        onClick={() => handleActionClick(individualData)}
                                        className="action-button" // Thêm class cho nút để styling
                                    >
                                        {t('searchEmail.continue')} {/* Sử dụng text từ file ngôn ngữ */}
                                    </button>
                                </td>
                            </tr>
                        );
                    }
                }
                setTableData(rows); // Cập nhật state một lần sau khi tất cả các Promise đã resolve
                setMessage(t('searchEmail.message_search_success'));
                setMessageType('success');
            } else {
                setMessage(t('searchEmail.message_no_data_found', { email }));
                setMessageType('error');
            }
        }
    };

    const handleActionClick = (individualData) => {
        saveToLocalStorage("registrationFormData", individualData.registration);
        saveToLocalStorage("paymentFormData", individualData.payment);
        saveToLocalStorage("healthInfoFormData", individualData.healthInfo);
        saveToLocalStorage("waiverFormData", individualData.waiverRelease);
        saveToLocalStorage("tnttRulesFormData", individualData.tnttRules);
        window.location.href = '/registration-adult';
    }

    const handleSkip = () => {
        setMessage(t('searchEmail.message_skipped'));
        setMessageType('info');
        setEmail('');
        setTableData([]); // Clear table data on skip
        setTimeout(() => {
            // window.location.href = '/next-page';
            console.log('Chuyển hướng đến trang tiếp theo.');
            setMessage('');
            window.location.href = '/registration-adult';
        }, 1500);
    };

    return (
        <div className="container">
            <h1>{t('searchEmail.search_data_title')}</h1>
            <p>{t('searchEmail.search_data_description')}</p>
            <input
                type="email"
                id="emailInput"
                placeholder={t('searchEmail.enter_email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div className="button-group">
                <button onClick={handleSearch} className="search-button">{t('searchEmail.search_button')}</button>
                <button onClick={handleSkip} className="skip-button">{t('searchEmail.skip_button')}</button>
            </div>
            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}
            {tableData.length > 0 && ( // Chỉ hiển thị bảng nếu có dữ liệu
                <table>
                    <thead>
                        <tr>
                            <th>{t('searchEmail.number')}</th>
                            <th>{t('searchEmail.id')}</th>
                            <th>{t('searchEmail.name')}</th>
                            <th>{t('searchEmail.dob')}</th>
                            <th>{t('searchEmail.continue')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row) => row)}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default EmailSearchAdult;