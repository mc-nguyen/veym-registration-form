export const extractDigits = (phoneNumberString) => {
    // Sử dụng biểu thức chính quy để tìm tất cả các chữ số (0-9)
    // và nối chúng lại thành một chuỗi duy nhất.
    if (!phoneNumberString) {
        return '';
    }
    return phoneNumberString.replace(/\D/g, '');
};

export const formatPhoneNumber = (digits) => {
    // Nếu chuỗi không đủ 10 chữ số, không định dạng
    digits = extractDigits(digits);
    if (digits.length !== 10) {
        return digits;
    }
    
    // Sử dụng string slicing để lấy các phần của số điện thoại
    const areaCode = digits.substring(0, 3);
    const prefix = digits.substring(3, 6);
    const lineNumber = digits.substring(6, 10);

    return `(${areaCode}) ${prefix}-${lineNumber}`;
};