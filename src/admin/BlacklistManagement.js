import React, { useState, useEffect } from 'react';
import { getEmailBlacklist, getPhoneBlacklist, addEmailToBlacklist, removeEmailFromBlacklist, addPhoneToBlacklist, removePhoneFromBlacklist } from '../context/firebaseFuncs';
import './BlacklistManagement.css';
import { extractDigits, formatPhoneNumber } from '../context/utilFuncs';
import ReturnToDashboardButton from './ReturnToDashboardButton';

const BlacklistManagement = () => {
    const [emails, setEmails] = useState([]);
    const [phones, setPhones] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBlacklists();
    }, []);

    const fetchBlacklists = async () => {
        setLoading(true);
        try {
            const fetchedEmails = await getEmailBlacklist();
            const fetchedPhones = await getPhoneBlacklist();
            setEmails(fetchedEmails.map((email, index) => ({ id: `email-${index}`, email })));
            setPhones(fetchedPhones.map((phone, index) => ({ id: `phone-${index}`, phone })));
        } catch (error) {
            console.error("Lỗi khi tải danh sách đen:", error);
            alert("Không thể tải danh sách đen. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmail = async (e) => {
        e.preventDefault();
        if (!newEmail) return;
        setLoading(true);
        try {
            await addEmailToBlacklist(newEmail.toLowerCase());
            setNewEmail('');
            fetchBlacklists(); // Tải lại danh sách
        } catch (error) {
            alert("Lỗi khi thêm email. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveEmail = async (docId) => {
        setLoading(true);
        try {
            await removeEmailFromBlacklist(docId);
            fetchBlacklists();
        } catch (error) {
            alert("Lỗi khi xóa email. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddPhone = async (e) => {
        e.preventDefault();
        if (!newPhone) return;
        setLoading(true);
        try {
            await addPhoneToBlacklist(extractDigits(newPhone));
            setNewPhone('');
            fetchBlacklists();
        } catch (error) {
            alert("Lỗi khi thêm số điện thoại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemovePhone = async (docId) => {
        setLoading(true);
        try {
            await removePhoneFromBlacklist(docId);
            fetchBlacklists();
        } catch (error) {
            alert("Lỗi khi xóa số điện thoại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blacklist-container">
            <h1>Quản lý Danh sách Chặn</h1>
            
            <div className="blacklist-section">
                <h2>Email bị chặn</h2>
                <form onSubmit={handleAddEmail}>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Nhập email mới để chặn"
                        required
                    />
                    <button type="submit" disabled={loading}>Thêm</button>
                </form>
                <ul>
                    {emails.map((item, index) => (
                        <li key={item.id}>
                            {item.email}
                            <button onClick={() => handleRemoveEmail(item.id)} disabled={loading}>Xóa</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="blacklist-section">
                <h2>Số điện thoại bị chặn</h2>
                <form onSubmit={handleAddPhone}>
                    <input
                        type="tel"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="Nhập số điện thoại mới để chặn"
                        required
                    />
                    <button type="submit" disabled={loading}>Thêm</button>
                </form>
                <ul>
                    {phones.map((item, index) => (
                        <li key={item.id}>
                            {formatPhoneNumber(item.phone)}
                            <button onClick={() => handleRemovePhone(item.id)} disabled={loading}>Xóa</button>
                        </li>
                    ))}
                </ul>
            </div>

            <ReturnToDashboardButton/>
        </div>
    );
};

export default BlacklistManagement;