// RegistrationForm.js
import React, { useState, useRef, useEffect } from "react";
import "./RegistrationForm.css";
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../../context/storageUtils';

const RegistrationForm = () => {
    removeFromLocalStorage('healthInfoFormData');
    removeFromLocalStorage('waiverFormData');
    removeFromLocalStorage('tnttRulesFormData');
    removeFromLocalStorage('paymentFormData');

    if (!getFromLocalStorage('currentPage'))
        window.location.href = '/';
    else if (getFromLocalStorage('currentPage') !== '/registration')
        window.location.href = getFromLocalStorage('currentPage');

    const [formData, setFormData] = useState(() => {
        // Load từ localStorage nếu có
        const savedData = getFromLocalStorage('registrationFormData') || {
            tenThanh: "",
            ho: "",
            tenDem: "",
            tenGoi: "",
            tenCha: "",
            tenMe: "",
            diaChi: "",
            phoneHome: "",
            phoneCell: "",
            phoneWork: "",
            phoneEmergency: "",
            email: "",
            ngaySinh: "",
        };
        return savedData;
    });

    const [nganh, setNganh] = useState(null);
    const [coKhanDo, setCoKhanDo] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [parentSignature, setParentSignature] = useState({
        name: '',
        relationship: 'Mẹ', // Mặc định là Mẹ
        date: new Date().toISOString().split('T')[0],
        signedImage: null
    });

    const parentCanvasRef = useRef(null);
    const [isParentDrawing, setIsParentDrawing] = useState(false);

    useEffect(() => {
        saveToLocalStorage('registrationFormData', formData);
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const tinhNganh = (ngaySinhStr, hasScarf = false) => {
        if (!ngaySinhStr) return null;

        const birthDate = new Date(ngaySinhStr);
        const sep1 = new Date(new Date().getFullYear(), 8, 1);
        let age = sep1.getFullYear() - birthDate.getFullYear();

        if (birthDate.getMonth() > 8 || (birthDate.getMonth() === 8 && birthDate.getDate() > 1)) {
            age--;
        }

        const nganhData = [
            { minAge: 17, maxAge: 17, label: "Hiệp Sĩ Cấp 2", color: "brown" },
            { minAge: 16, maxAge: 16, label: "Hiệp Sĩ Cấp 1", color: "brown" },
            { minAge: 15, maxAge: 15, label: "Nghĩa Sĩ Cấp 3", color: "gold" },
            { minAge: 14, maxAge: 14, label: "Nghĩa Sĩ Cấp 2", color: "gold" },
            { minAge: 13, maxAge: 13, label: "Nghĩa Sĩ Cấp 1", color: "gold" },
            { minAge: 12, maxAge: 12, label: "Thiếu Nhi Cấp 3", color: "blue" },
            { minAge: 11, maxAge: 11, label: "Thiếu Nhi Cấp 2", color: "blue" },
            { minAge: 10, maxAge: 10, label: "Thiếu Nhi Cấp 1", color: "blue" },
            { minAge: 9, maxAge: 9, label: "Ấu Nhi Cấp 3", color: "green" },
            { minAge: 8, maxAge: 8, label: "Ấu Nhi Cấp 2", color: "green" },
            { minAge: 7, maxAge: 7, label: "Ấu Nhi Cấp 1", color: "green" },
            { minAge: 6, maxAge: 6, label: "Ấu Nhi Dự Bị", color: "green" },
        ];

        return nganhData.find(item =>
            age >= item.minAge &&
            (!item.maxAge || age <= item.maxAge) &&
            (!item.hasScarf || hasScarf)
        ) || null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "ngaySinh") {
            setNganh(tinhNganh(value, coKhanDo));
        }
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


    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra chữ ký phụ huynh
        if (!parentSignature.signedImage) {
            alert('Vui lòng ký tên xác nhận của phụ huynh');
            return;
        }

        // Tạo thông báo xác nhận
        const confirmationMessage = `
            XIN XÁC NHẬN LẦN CUỐI:
            
            Tên đoàn sinh: ${formData.ho} ${formData.tenDem} ${formData.tenGoi}
            Ngày sinh: ${formData.ngaySinh || 'Chưa nhập'}
            Ngành: ${nganh?.label || 'Chưa xác định'}
            Tên phụ huynh: ${parentSignature.name} (${parentSignature.relationship})
            
            Bạn chắc chắn muốn gửi đơn đăng ký này?
        `;

        // Hiển thị alert xác nhận
        const isConfirmed = window.confirm(confirmationMessage);

        if (isConfirmed) {
            // Xử lý khi người dùng đồng ý
            const registrationData = {
                ...formData,
                studentSignature: canvasRef.current.toDataURL(),
                studentSignedDate: new Date().toLocaleDateString('vi-VN'),
                parentSignature: {
                    ...parentSignature,
                    signedDate: new Date().toLocaleDateString('vi-VN')
                }
            };

            console.log('Dữ liệu đã gửi:', registrationData);
            saveToLocalStorage('registrationFormData', registrationData);

            // Chuyển hướng sau 1 giây
            setTimeout(() => {
                saveToLocalStorage('currentPage', '/payment')
                window.location.href = '/payment'; // Thay bằng route của bạn
            }, 1000);
        }
    };

    const startParentDrawing = (e) => {
        const canvas = parentCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
        setIsParentDrawing(true);
    };

    const drawParent = (e) => {
        if (!isParentDrawing) return;
        e.preventDefault();

        const canvas = parentCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.strokeStyle = '#d32f2f'; // Màu đỏ cho phụ huynh
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    };

    const endParentDrawing = () => {
        setIsParentDrawing(false);
        // Lưu chữ ký khi hoàn thành
        setParentSignature(prev => ({
            ...prev,
            signedImage: parentCanvasRef.current.toDataURL()
        }));
    };

    const clearParentCanvas = () => {
        const canvas = parentCanvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setParentSignature(prev => ({ ...prev, signedImage: null }));
    };

    const handleParentInfoChange = (e) => {
        const { name, value } = e.target;
        setParentSignature(prev => ({
            ...prev,
            [name]: name === 'name' ? value.toUpperCase() : value
        }));
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
                    <label>Con của ông và bà:</label>
                    <div className="parent-row">
                        <input type="text" name="tenCha" placeholder="Tên Cha" value={formData.tenCha} onChange={handleChange} required />
                        <input type="text" name="tenMe" placeholder="Tên Mẹ" value={formData.tenMe} onChange={handleChange} required />
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
                        <button type="button" className="secondary-btn" onClick={() => setNganh(tinhNganh(formData.ngaySinh, coKhanDo))}>
                            Xác định ngành
                        </button>
                    </div>
                </div>

                {nganh && (
                    <div className="nganh-result">
                        <div className={`nganh-display ${nganh.color}`}>
                            <span className="arrow">➤</span> Ngành: {nganh.label}
                        </div>
                    </div>
                )}
            </div>

            <div className="form-section pledge-section">
                <h3>Lời hứa</h3>
                <div className="pledge">
                    <p>
                        Em xin được ghi danh gia nhập phong trào TNTT tại Ðoàn TNTT Mẹ Thiên Chúa, Riverside. Em hứa sẽ vâng lời và
                        theo sự hướng dẫn của cha Tuyên Úy Ðoàn, Đoàn Trưởng, các trợ tá, các phụ huynh cũng như các anh chị huynh
                        trưởng có trách nhiệm trong đoàn và trong ngành mà em sinh hoạt hằng tuần. Em sẽ cố gắng sống 4 khẩu hiệu của
                        Thiếu Nhi: <strong>Cầu Nguyện, Rước Lễ, Hy Sinh</strong> và <strong>Làm Việc Tông Ðồ</strong> cũng như thực hành các tôn chỉ của phong trào TNTT.
                        Em sẽ chu toàn bổn phận của một đoàn sinh trong đoàn TNTT và thực thi đúng các nội quy của đoàn TNTT.
                    </p>
                </div>

                <div className="signature-area">
                    <label>Đoàn Sinh ký tên - Ngày {new Date().toLocaleDateString('vi-VN')}</label>
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

            <div className="parent-signature-section">
                <h3 className="section-title">XÁC NHẬN CỦA PHỤ HUYNH</h3>

                <div className="parent-info-grid">
                    <div className="form-group">
                        <label>Họ và tên phụ huynh:</label>
                        <input
                            type="text"
                            name="name"
                            value={parentSignature.name}
                            onChange={handleParentInfoChange}
                            placeholder="Tên phụ huynh"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Quan hệ với Đoàn Sinh:</label>
                        <select
                            name="relationship"
                            value={parentSignature.relationship}
                            onChange={handleParentInfoChange}
                            required
                        >
                            <option value="Mẹ">Mẹ</option>
                            <option value="Cha">Cha</option>
                            <option value="Người giám hộ">Người giám hộ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ngày ký: {new Date().toLocaleDateString('vi-VN')}</label>
                    </div>

                    <div className="form-group">
                        <label>Tôi cho phép con tôi sinh hoạt <strong>Ðoàn TNTT-Mẹ Thiên Chúa, Riverside.</strong> Tôi sẽ hoàn toàn chịu trách nhiệm nếu có những
                            trường hợp không may xảy ra với con tôi trong các giờ sinh hoạt của đoàn.</label>
                    </div>
                </div>

                <div className="signature-area">
                    <label>Chữ ký xác nhận:</label>
                    <canvas
                        ref={parentCanvasRef}
                        className="signature-canvas parent-canvas"
                        onMouseDown={startParentDrawing}
                        onMouseMove={drawParent}
                        onMouseUp={endParentDrawing}
                        onMouseLeave={endParentDrawing}
                        onTouchStart={startParentDrawing}
                        onTouchMove={drawParent}
                        onTouchEnd={endParentDrawing}
                    />
                    <div className="signature-actions">
                        <button type="button" className="clear-btn" onClick={clearParentCanvas}>
                            <i className="fas fa-eraser"></i> Xóa chữ ký
                        </button>
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="submit-btn">Chuyển tiếp</button>
            </div>
        </form>
    );
};

export default RegistrationForm;