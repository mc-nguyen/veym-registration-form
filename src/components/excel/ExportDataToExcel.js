// src/components/ExportDataToExcel.js
import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Import thư viện xlsx
import { getAllRegistrationsData } from '../../context/firebaseFuncs'; // Điều chỉnh đường dẫn nếu cần
import { useLanguage } from '../../LanguageContext'; // Để dịch các tiêu đề cột

const ExportDataToExcel = () => {
    const { translate: t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleExport = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAllRegistrationsData(); // Hàm này giờ đã trả về data.registration và đã được sắp xếp

            if (data.length === 0) {
                alert(t('exportExcel.noDataFound'));
                setIsLoading(false);
                return;
            }

            // Định nghĩa các tiêu đề cột chỉ cho dữ liệu registration
            const headers = [
                { key: 'tenThanh', title: t('exportExcel.tenThanh') },
                { key: 'ho', title: t('exportExcel.ho') },
                { key: 'tenDem', title: t('exportExcel.tenDem') },
                { key: 'tenGoi', title: t('exportExcel.tenGoi') },
                { key: 'tenCha', title: t('exportExcel.tenCha') },
                { key: 'tenMe', title: t('exportExcel.tenMe') },
                { key: 'diaChi', title: t('exportExcel.diaChi') },
                { key: 'phoneHome', title: t('exportExcel.phoneHome') },
                { key: 'phoneCell', title: t('exportExcel.phoneCell') },
                { key: 'phoneWork', title: t('exportExcel.phoneWork') },
                { key: 'phoneEmergency', title: t('exportExcel.phoneEmergency') },
                { key: 'email', title: t('exportExcel.email') },
                { key: 'day', title: t('exportExcel.birthDay') },
                { key: 'month', title: t('exportExcel.birthMonth') },
                { key: 'year', title: t('exportExcel.birthYear') },
                { key: 'nganh', title: t('exportExcel.nganh') },
                { key: 'parentSignature', title: t('exportExcel.parentSignature') }, // Chữ ký cha mẹ trên form đăng ký
                { key: 'nguoiGiamHo', title: t('exportExcel.nguoiGiamHo') },
                { key: 'moiQuanHe', title: t('exportExcel.moiQuanHe') }
            ];

            // Chuẩn bị dữ liệu cho Excel
            const rows = data.map(item => {
                const rowData = {};
                headers.forEach(header => {
                    // Xử lý chữ ký (Data URL)
                    if (header.key === 'parentSignature' && item[header.key]) {
                        rowData[header.title] = 'Signed (Data URL available)';
                    } else {
                        rowData[header.title] = item[header.key] || ''; // Lấy giá trị, nếu undefined thì là chuỗi rỗng
                    }
                });
                return rowData;
            });

            // Tạo worksheet
            const ws = XLSX.utils.json_to_sheet(rows, { header: headers.map(h => h.title) });

            // Tạo workbook và thêm worksheet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Registrations"); // Tên sheet

            // Xuất file Excel
            const fileName = `TNTT_Registrations_${new Date().toLocaleDateString('en-CA')}.xlsx`;
            XLSX.writeFile(wb, fileName);

        } catch (err) {
            console.error("Error exporting data:", err);
            setError(t('exportExcel.exportError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h2>{t('exportExcel.exportTitle')}</h2>
            <button
                onClick={handleExport}
                disabled={isLoading}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    backgroundColor: isLoading ? '#ccc' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    margin: '0 auto'
                }}
            >
                {isLoading ? (
                    <>
                        <i className="fas fa-spinner fa-spin"></i> {t('exportExcel.exporting')}
                    </>
                ) : (
                    <>
                        <i className="fas fa-file-excel"></i> {t('exportExcel.exportButton')}
                    </>
                )}
            </button>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
};

export default ExportDataToExcel;