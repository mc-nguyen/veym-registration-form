// src/pages/MaintenancePage/MaintenancePage.js
import React from 'react';
import './MaintenancePage.css'; // Tạo file CSS tương ứng

const MaintenancePage = () => {
    return (
        <div className="maintenance-container">
            <h1>Trang web đang được bảo trì</h1>
            <p>Ban Ghi Danh đang trong quá trình bảo trì những sự cố liên quan tới website. Chúng tôi sẽ không hứa sẽ quay lại nhưng sẽ trở lại trong thời gian sớm nhất. Xin thứ lỗi và mong quý vị thông cảm!</p>
            <p>The registration team is currently performing maintenance on the website to resolve some issues. We cannot promise a specific return time but will be back as soon as possible. We apologize for any inconvenience this may cause and thank you for your patience!</p>
        </div>
    );
};

export default MaintenancePage;