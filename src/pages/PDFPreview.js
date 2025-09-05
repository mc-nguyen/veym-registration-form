import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PDFPreview.css';

const PDFPreview = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [pdfData, setPdfData] = useState(null);

    useEffect(() => {
        // Lấy dữ liệu PDF từ state của router
        if (location.state && location.state.pdfData) {
            setPdfData(location.state.pdfData);
        } else {
            // Nếu không có dữ liệu, chuyển về trang chủ và thông báo
            alert('Không tìm thấy dữ liệu PDF.');
            navigate('/');
        }
    }, [location, navigate]);

    const handleDownload = () => {
        // Tạo một thẻ <a> ẩn để tải file
        if (pdfData) {
            const link = document.createElement('a');
            link.href = pdfData;
            link.download = 'document.pdf'; // Tên file khi tải xuống
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
    return (
        <div className="pdf-viewer-container">
            <div className="pdf-viewer-header">
                <button onClick={() => navigate('/')} className="home-button">
                    Trang chủ
                </button>
                <div className="action-buttons">
                    <button onClick={() => window.print()} className="print-button">
                        In
                    </button>
                    <button onClick={handleDownload} className="download-button">
                        Tải xuống
                    </button>
                </div>
            </div>

            {pdfData ? (
                <iframe 
                    src={pdfData} 
                    title="PDF Viewer" 
                    className="pdf-iframe" 
                    frameBorder="0"
                />
            ) : (
                <p>Đang tải PDF...</p>
            )}
        </div>
    );
};

export default PDFPreview;