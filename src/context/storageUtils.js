// Lưu dữ liệu vào localStorage
export const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

// Lấy dữ liệu từ localStorage
export const getFromLocalStorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting from localStorage:', error);
        return null;
    }
};

// Xóa dữ liệu từ localStorage
export const removeFromLocalStorage = (key) => {
    localStorage.removeItem(key);
};

export const isSessionValid = () => {
    const lastLoginTime = localStorage.getItem('lastLoginTime');
    const threeMonthsInMs = 90 * 24 * 60 * 60 * 1000;
    if (lastLoginTime && (Date.now() - lastLoginTime) < threeMonthsInMs) {
        return true;
    }
    return false;
};