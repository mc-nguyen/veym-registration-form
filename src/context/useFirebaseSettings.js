// src/context/useFirebaseSettings.js

import { useState, useEffect } from 'react';
import { getSettingsFromFirebase } from './firebaseFuncs';

const useFirebaseSettings = () => {
    const [prices, setPrices] = useState([]);
    const [committee, setCommittee] = useState([]);
    const [spiritualDirectorName, setSpiritualDirectorName] = useState('');
    const [leaderName, setLeaderName] = useState('');
    const [leaderPhone, setLeaderPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const fetchedSettings = await getSettingsFromFirebase();
                if (fetchedSettings) {
                    // Lấy các giá trị phí và đưa vào mảng
                    const fetchedPrices = [
                        { id: 1, name: 'Niên liễm', amount: fetchedSettings.registrationFee },
                        { id: 2, name: 'Đồng phục', amount: fetchedSettings.uniformCost },
                        { id: 3, name: 'Váy', amount: fetchedSettings.skortCost },
                        { id: 4, name: 'Khăn', amount: fetchedSettings.scarfCost }
                    ];
                    setPrices(fetchedPrices);
                    
                    // Lấy danh sách ban ghi danh
                    setCommittee(fetchedSettings.committee);

                    setSpiritualDirectorName(fetchedSettings.spiritualDirectorName || '');
                    setLeaderName(fetchedSettings.leaderName || '');
                    setLeaderPhone(fetchedSettings.leaderPhone || '');
                }
            } catch (err) {
                console.error("Error fetching settings:", err);
                setError("Không thể tải cài đặt.");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    return { prices, committee, spiritualDirectorName, leaderName, leaderPhone, loading, error };
};

export default useFirebaseSettings;