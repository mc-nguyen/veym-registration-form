// RegistrationForm.js
import React, { useState, useRef, useEffect } from "react";
import "./RegistrationForm.css";
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../../context/storageUtils';
import { saveRegistrationToFirebase } from "../../context/firebaseFuncs";

const RegistrationFormAdult = () => {
    removeFromLocalStorage('healthInfoFormData');
    removeFromLocalStorage('waiverFormData');
    removeFromLocalStorage('tnttRulesFormData');
    removeFromLocalStorage('paymentFormData');

    if (!getFromLocalStorage('currentPage'))
        window.location.href = '/';
    else if (getFromLocalStorage('currentPage') !== '/registration-adult')
        window.location.href = getFromLocalStorage('currentPage');

    const [formData, setFormData] = useState(() => {
        // Load từ localStorage nếu có
        const savedData = getFromLocalStorage('registrationFormData') || {
            tenThanh: "",
            ho: "",
            tenDem: "",
            tenGoi: "",
            diaChi: "",
            phoneHome: "",
            phoneCell: "",
            phoneWork: "",
            phoneEmergency: "",
            email: "",
            ngaySinh: "",
            nganh: ""
        };
        return savedData;
    });

    const [isMobile, setIsMobile] = useState(false);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        saveToLocalStorage('registrationFormData', formData);
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý chữ ký số
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        ctx.beginPath();
        ctx.moveTo(
            (e.clientX || e.touches[0].clientX) - rect.left,
            (e.clientY || e.touches[0].clientY) - rect.top
        );
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        ctx.lineTo(
            (e.clientX || e.touches[0].clientX) - rect.left,
            (e.clientY || e.touches[0].clientY) - rect.top
        );
        ctx.strokeStyle = '#2d8fdd';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    };

    const endDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tạo thông báo xác nhận
        const confirmationMessage = `
            XIN XÁC NHẬN LẦN CUỐI:
            
            Tên đoàn sinh: ${formData.ho} ${formData.tenDem} ${formData.tenGoi}
            Ngày sinh: ${formData.ngaySinh || 'Chưa nhập'}
            Ngành: ${formData.nganh || 'Chưa xác định'}
            
            Bạn chắc chắn muốn gửi đơn đăng ký này?
        `;

        // Hiển thị alert xác nhận
        const isConfirmed = window.confirm(confirmationMessage);

        if (isConfirmed) {
            // Xử lý khi người dùng đồng ý
            const registrationData = {
                ...formData,
                signature: canvasRef.current.toDataURL(),
                signedDate: new Date().toLocaleDateString('vi-VN')
            };

            console.log('Dữ liệu đã gửi:', registrationData);
            const dataID = await saveRegistrationToFirebase(registrationData);
            saveToLocalStorage('id', dataID);

            // Chuyển hướng sau 1 giây
            setTimeout(() => {
                saveToLocalStorage('currentPage', '/payment-adult')
                window.location.href = '/payment-adult'; // Thay bằng route của bạn
            }, 1000);
        }
    };

    return (
        <form className="registration-form" onSubmit={handleSubmit}>
            <h2>Đơn Ghi Danh Đoàn Thiếu Nhi Thánh Thể</h2>
            <p className="form-subtitle">Năm học 2025-2026</p>

            <div className="form-section">
                <h3>Thông tin cá nhân</h3>

                <div className="form-group">
                    <label>Em tên là:</label>
                    <div className="name-row">
                        <input type="text" name="tenThanh" placeholder="Tên Thánh" value={formData.tenThanh} onChange={handleChange} required />
                        <input type="text" name="ho" placeholder="Họ" value={formData.ho} onChange={handleChange} required />
                        <input type="text" name="tenDem" placeholder="Tên Đệm" value={formData.tenDem} onChange={handleChange} />
                        <input type="text" name="tenGoi" placeholder="Tên Gọi" value={formData.tenGoi} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Địa chỉ nhà:</label>
                    <input type="text" name="diaChi" value={formData.diaChi} onChange={handleChange} required />
                </div>
            </div>

            <div className="form-section">
                <h3>Thông tin liên lạc</h3>

                <div className="form-group">
                    <label>Điện thoại liên lạc:</label>
                    <div className="phone-row">
                        <input type="tel" name="phoneHome" placeholder="Nhà" value={formData.phoneHome} onChange={handleChange} />
                        <input type="tel" name="phoneCell" placeholder="Di động (bắt buộc)" value={formData.phoneCell} onChange={handleChange} required />
                        <input type="tel" name="phoneWork" placeholder="Cơ quan" value={formData.phoneWork} onChange={handleChange} />
                    </div>
                </div>

                <div className="form-group">
                    <label>Số điện thoại khẩn cấp:</label>
                    <input type="tel" name="phoneEmergency" placeholder="Số khẩn cấp" value={formData.phoneEmergency} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
            </div>

            <div className="form-section">
                <h3>Thông tin sinh hoạt</h3>

                <div className="form-group">
                    <label>Ngày sinh:</label>
                    <div className="dob-row">
                        <input type="date" name="ngaySinh" value={formData.ngaySinh} onChange={handleChange} required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Ngành sinh hoạt:</label>
                    <select
                        name="nganh"
                        value={formData.nganh || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Chọn ngành --</option>
                        <option value="Hiệp Sĩ Trưởng Thành">Hiệp Sĩ Trưởng Thành</option>
                        <option value="Huynh Trưởng">Huynh Trưởng</option>
                        <option value="Trợ Tá">Trợ Tá</option>
                        <option value="Huấn Luyện Viên">Huấn Luyện Viên</option>
                    </select>
                </div>
            </div>

            <div className="form-section pledge-section">
                <h3>Lời hứa</h3>
                <div className="pledge">
                    <p>
                        Tôi xin được ghi danh gia nhập phong trào TNTT tại Ðoàn TNTT Mẹ Thiên Chúa, Riverside. Tôi hứa sẽ vâng lời và
                        theo sự hướng dẫn của cha Tuyên Úy Ðoàn, Đoàn Trưởng, các trợ tá, các phụ huynh cũng như các anh chị em huynh
                        trưởng có trách nhiệm trong đoàn và trong ngành mà tôi sinh hoạt hằng tuần. Tôi sẽ cố gắng sống 4 khẩu hiệu của
                        Thiếu Nhi: <strong>Cầu Nguyện, Rước Lễ, Hy Sinh</strong> và <strong>Làm Việc Tông Ðồ</strong> cũng như thực hành các tôn chỉ của phong trào TNTT.
                        Tôi sẽ chu toàn bổn phận của một đoàn sinh trong đoàn TNTT và thực thi đúng các nội quy của đoàn TNTT.
                    </p>
                </div>

                <div className="signature-area">
                    <label>Ký tên - Ngày {new Date().toLocaleDateString('vi-VN')}</label>
                    <canvas
                        ref={canvasRef}
                        width={isMobile ? 300 : 500}
                        height={150}
                        className="signature-canvas"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={endDrawing}
                        onMouseLeave={endDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={endDrawing}
                    />
                    <button type="button" className="clear-btn" onClick={clearCanvas}>Xóa chữ ký</button>
                    <p className="signature-note">(Xin ký tên vào khung trên)</p>
                </div>
            </div>
            
            <div className="form-actions">
                <button type="submit" className="submit-btn">Chuyển tiếp</button>
            </div>
        </form>
    );
};

export default RegistrationFormAdult;