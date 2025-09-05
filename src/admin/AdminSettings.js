import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore'; // Thêm onSnapshot
import { getSettingsFromFirebase, saveSettingsToFirebase, db, updateSettings } from '../context/firebaseFuncs';
import './AdminSettings.css';
import ReturnToDashboardButton from './ReturnToDashboardButton';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        registrationFee: 0,
        uniformCost: 0,
        scarfCost: 0,
        skortCost: 0,
        committee: [],
        spiritualDirectorName: '', // Thêm trường mới
        leaderName: '',           // Thêm trường mới
        leaderPhone: '',          // Thêm trường mới
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');

    // State riêng cho chế độ bảo trì, được lắng nghe theo thời gian thực
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [loadingMaintenance, setLoadingMaintenance] = useState(true);

    useEffect(() => {
        const settingsRef = doc(db, 'settings', 'app_settings');
        const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setIsMaintenanceMode(data.isMaintenanceMode || false);
                setLoadingMaintenance(false);
            } else {
                console.error("Không tìm thấy tài liệu cài đặt.");
                setLoadingMaintenance(false);
            }
        }, (err) => {
            console.error("Lỗi khi lắng nghe cài đặt:", err);
            setLoadingMaintenance(false);
        });

        // Hủy lắng nghe khi component unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const fetchedSettings = await getSettingsFromFirebase();
                if (fetchedSettings) {
                    setSettings(prevSettings => ({
                        ...prevSettings,
                        ...fetchedSettings
                    }));
                }
            } catch (err) {
                console.error("Lỗi khi tải cài đặt:", err);
                setError("Không thể tải cài đặt. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleCommitteeChange = (index, e) => {
        const { name, value } = e.target;
        const updatedCommittee = [...settings.committee];
        updatedCommittee[index] = { ...updatedCommittee[index], [name]: value };
        setSettings(prev => ({ ...prev, committee: updatedCommittee }));
    };

    const handleAddCommittee = () => {
        setSettings(prev => ({
            ...prev,
            committee: [...prev.committee, { name: '', phone: '' }]
        }));
    };

    const handleRemoveCommittee = (index) => {
        const updatedCommittee = settings.committee.filter((_, i) => i !== index);
        setSettings(prev => ({ ...prev, committee: updatedCommittee }));
    };

    const toggleMaintenanceMode = async () => {
        const newMode = !isMaintenanceMode;
        try {
            // Chỉ cập nhật trạng thái bảo trì, không cần tải lại trang
            await updateSettings({ isMaintenanceMode: newMode });
        } catch (e) {
            console.error("Lỗi khi cập nhật trạng thái bảo trì:", e);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage('');
        try {
            await saveSettingsToFirebase(settings);
            setStatusMessage("Lưu cài đặt thành công!");
        } catch (err) {
            console.error("Lỗi khi lưu cài đặt:", err);
            setError("Lỗi khi lưu cài đặt. Vui lòng thử lại.");
        } finally {
            setLoading(false);
            setTimeout(() => setStatusMessage(''), 3000);
        }
    };

    if (loadingMaintenance && loading) {
        return <div className="loading-state">Đang tải cài đặt...</div>;
    }
    if (error) return <div className="error-message">Đã xảy ra lỗi: {error}</div>;

    return (
        <div className="admin-container">
            <h1>Cài Đặt Trang Web</h1>
            <form onSubmit={handleSave}>
                <div className="section">
                    <h2>Thông tin chung</h2>
                    <div className="form-group">
                        <label htmlFor="spiritualDirectorName">Tên Cha Tuyên Úy</label>
                        <input
                            type="text"
                            id="spiritualDirectorName"
                            name="spiritualDirectorName"
                            value={settings.spiritualDirectorName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="leaderName">Tên Đoàn Trưởng</label>
                        <input
                            type="text"
                            id="leaderName"
                            name="leaderName"
                            value={settings.leaderName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="leaderPhone">Số điện thoại Đoàn Trưởng</label>
                        <input
                            type="text"
                            id="leaderPhone"
                            name="leaderPhone"
                            value={settings.leaderPhone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Các phần khác (Chi phí đăng ký, Ban ghi danh) */}

                <div className="section">
                    <h2>Chi phí đăng ký</h2>
                    <div className="form-group">
                        <label>Phí Niên liễm ($):</label>
                        <input type="number" name="registrationFee" value={settings.registrationFee} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Phí Áo đồng phục ($):</label>
                        <input type="number" name="uniformCost" value={settings.uniformCost} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Phí Skort ($):</label>
                        <input type="number" name="skortCost" value={settings.skortCost} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Phí Khăn ($):</label>
                        <input type="number" name="scarfCost" value={settings.scarfCost} onChange={handleChange} />
                    </div>
                </div>

                <div className="section">
                    <h2>Ban ghi danh</h2>
                    {settings.committee.map((member, index) => (
                        <div key={index} className="committee-member-group">
                            <div className="form-group">
                                <label>Tên:</label>
                                <input type="text" name="name" value={member.name} onChange={(e) => handleCommitteeChange(index, e)} />
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại:</label>
                                <input type="text" name="phone" value={member.phone} onChange={(e) => handleCommitteeChange(index, e)} />
                            </div>
                            <button type="button" onClick={() => handleRemoveCommittee(index)} className="remove-button">Xóa</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddCommittee} className="add-button">Thêm Thành Viên</button>
                </div>

                {/* Phần dành riêng cho chế độ bảo trì, sử dụng state riêng */}
                <div className="settings-section">
                    <h3>Chế độ Bảo Trì</h3>
                    <div className="maintenance-toggle-container">
                        <button 
                            type="button"
                            onClick={toggleMaintenanceMode}
                            disabled={loadingMaintenance}
                            className={`maintenance-btn ${isMaintenanceMode ? 'maintenance-on' : 'maintenance-off'}`}
                        >
                            {isMaintenanceMode ? "Tắt Bảo Trì" : "Bật Bảo Trì"}
                        </button>
                        <span className="maintenance-status">
                            Trạng thái: **{isMaintenanceMode ? 'ĐANG BẬT' : 'ĐANG TẮT'}**
                        </span>
                    </div>
                </div>

                <button type="submit" className="save-button" disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu Cài Đặt'}
                </button>
                {statusMessage && <p className="status-message">{statusMessage}</p>}
            </form>

            <ReturnToDashboardButton /> {/* Thêm component nút ở đây */}
        </div>
    );
};

export default AdminSettings;