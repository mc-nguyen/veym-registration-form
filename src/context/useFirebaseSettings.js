// src/context/useFirebaseSettings.js

import { useState, useEffect } from 'react';
import { getSettingsFromFirebase } from './firebaseFuncs';

const useFirebaseSettings = () => {
    const [prices, setPrices] = useState([]);
    const [committee, setCommittee] = useState([]);
    const [spiritualDirectorName, setSpiritualDirectorName] = useState('');
    const [leaderName, setLeaderName] = useState('');
    const [leaderPhone, setLeaderPhone] = useState('');
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false); // Thêm state mới
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const fetchedSettings = await getSettingsFromFirebase();
                if (fetchedSettings) {
                    const fetchedPrices = [
                        { id: 1, name: 'Niên liễm', amount: fetchedSettings.registrationFee },
                        { id: 2, name: 'Áo Đồng phục', amount: fetchedSettings.uniformCost },
                        { id: 3, name: 'Skort Đồng phục', amount: fetchedSettings.skortCost },
                        { id: 4, name: 'Khăn TNTT', amount: fetchedSettings.scarfCost }
                    ];
                    setPrices(fetchedPrices);
                    setCommittee(fetchedSettings.committee || []);
                    setSpiritualDirectorName(fetchedSettings.spiritualDirectorName || '');
                    setLeaderName(fetchedSettings.leaderName || '');
                    setLeaderPhone(fetchedSettings.leaderPhone || '');
                    // Cập nhật state isMaintenanceMode từ Firebase
                    setIsMaintenanceMode(fetchedSettings.isMaintenanceMode || false);
                }
            } catch (err) {
                console.error("Lỗi khi tải cài đặt:", err);
                setError("Không thể tải cài đặt.");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Thêm isMaintenanceMode vào đối tượng trả về
    return { prices, committee, spiritualDirectorName, leaderName, leaderPhone, isMaintenanceMode, loading, error };
};

export default useFirebaseSettings;