// src/pages/AdminPage/AdminContactMessagesList.js
import React, { useState, useEffect } from 'react';
import { getContactMessages } from '../context/firebaseFuncs';
import './AdminContactMessagesList.css';
import ReturnToDashboardButton from './ReturnToDashboardButton';

const AdminContactMessagesList = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedMessages = await getContactMessages();
                setMessages(fetchedMessages);
            } catch (err) {
                console.error("Error fetching contact messages:", err);
                setError("Không thể tải danh sách tin nhắn.");
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JS bắt đầu từ 0
        const year = date.getFullYear();
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    if (loading) return <div className="loading-state">Đang tải danh sách tin nhắn...</div>;
    if (error) return <div className="error-state">Có lỗi xảy ra: {error}</div>;

    return (
        <div className="admin-container">
            <h1>Danh Sách Tin Nhắn Liên Hệ</h1>
            
            {messages.length === 0 ? (
                <div className="no-data">Không có tin nhắn nào.</div>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Thời gian</th>
                                <th>Họ Tên</th>
                                <th>Email</th>
                                <th>Tiêu đề</th>
                                <th>Nội dung</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(msg => (
                                <tr key={msg.id}>
                                    <td>{formatTimestamp(msg.timestamp)}</td>
                                    <td>{msg.name}</td>
                                    <td>{msg.email}</td>
                                    <td>{msg.subject}</td>
                                    <td>{msg.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ReturnToDashboardButton/>
        </div>
    );
};

export default AdminContactMessagesList;