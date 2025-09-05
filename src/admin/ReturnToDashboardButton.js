import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ReturnToDashboardButton.css'; // Import file CSS

const ReturnToDashboardButton = ({ label = 'Quay lại Dashboard' }) => {
    const navigate = useNavigate();

    const handleReturn = () => {
        navigate('/admin');
    };

    return (
        <button
            onClick={handleReturn}
            className="return-dashboard-btn"
        >
            {label}
        </button>
    );
};

export default ReturnToDashboardButton;