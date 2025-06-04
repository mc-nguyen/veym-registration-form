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

// Tương tự cho sessionStorage
export const saveToSessionStorage = (key, data) => {
    try {
        sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to sessionStorage:', error);
    }
};

export const getFromSessionStorage = (key) => {
    try {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting from sessionStorage:', error);
        return null;
    }
};

export const removeFromSessionStorage = (key) => {
    sessionStorage.removeItem(key);
};