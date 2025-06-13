// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection, getDoc, doc, updateDoc, setDoc, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARp0BLDeCTnrWYIrNtdbNqeQ_MRzQShTw",
  authDomain: "mtc-riverside-database.firebaseapp.com",
  projectId: "mtc-riverside-database",
  storageBucket: "mtc-riverside-database.firebasestorage.app",
  messagingSenderId: "249791371280",
  appId: "1:249791371280:web:49be35affb4769c36f9295"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const saveRegistrationToFirebase = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "registrations"), {
      registration: data,
      status: 'pending'
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

export const savePaymentToFirebase = async (id, data) => {
  try {
    const docRef = doc(db, 'registrations', id);
    await updateDoc(docRef, { payment: data });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const saveHealthInfoToFirebase = async (id, data) => {
  try {
    const docRef = doc(db, 'registrations', id);
    await updateDoc(docRef, { healthInfo: data });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const saveWaiverReleaseToFirebase = async (id, data) => {
  try {
    const docRef = doc(db, 'registrations', id);
    await updateDoc(docRef, { waiverRelease: data });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const saveTNTTRulesToFirebase = async (id, data) => {
  try {
    const docRef = doc(db, 'registrations', id);
    await updateDoc(docRef, {
      tnttRules: data,
      status: 'completed'
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const getDataById = async (docId) => {
  try {
    const docRef = doc(db, 'registrations', docId); // 'registrations' là tên collection của bạn
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Dữ liệu đã tìm thấy:", data);
      return data; // Trả về dữ liệu ở định dạng JSON
    } else {
      console.log("Không tìm thấy tài liệu với ID:", docId);
      return null; // Trả về null nếu không tìm thấy
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    throw error; // Ném lỗi để component gọi có thể bắt và xử lý
  }
};

export const getDataByEmail = async (email) => {
  try {
    const docRef = doc(db, 'emails', email); // 'registrations' là tên collection của bạn
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Dữ liệu đã tìm thấy:");
      return data; // Trả về dữ liệu ở định dạng JSON
    } else {
      console.log("Không tìm thấy tài liệu với ID:", email);
      return null; // Trả về null nếu không tìm thấy
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    throw error; // Ném lỗi để component gọi có thể bắt và xử lý
  }
};

export const saveEmailWithID = async (email, id) => {
  try {
    // Sử dụng doc() để tạo tham chiếu tài liệu với email làm ID
    // Sau đó dùng setDoc() để ghi dữ liệu vào tài liệu đó
    const existed = await getDoc(doc(db, 'emails', email));
    if (!existed.exists()) {// ko tồn tại
      console.log("Ko tìm thấy " + email);

      await setDoc(doc(db, 'emails', email), {
        length: 1,
        0: id
      });
    }
    else {
      console.log("tìm thấy " + email);
      await updateDoc(doc(db, 'emails', email), {
        [existed.data().length]: id,
        length: existed.data().length + 1
      });
    }
    return email; // Trả về ID tài liệu (chính là email)
  } catch (error) {
    console.error("Lỗi khi lưu tài liệu:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
}

export const saveParentSurvey = async (dataArray) => {
  try {
    const registrationData = {};
    dataArray.forEach((data, index) => {
      if (data !== undefined) { // Check for undefined before assigning
        registrationData[index.toString()] = data;
      }
    });

    const docRef = await addDoc(collection(db, "parents"), registrationData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

export const getAllRegistrationsData = async () => {
  try {
    const registrationsRef = collection(db, 'registrations');
    const querySnapshot = await getDocs(registrationsRef);

    let allRegistrationsData = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.registration) { // Chỉ lấy nếu có phần 'registration'
        allRegistrationsData.push(data.registration);
      }
    });

    // Định nghĩa thứ tự ưu tiên của các ngành
    const nganhOrder = [
      "Ấu Nhi Dự Bị", "Ấu Nhi Cấp 1", "Ấu Nhi Cấp 2", "Ấu Nhi Cấp 3",
      "Thiếu Nhi Cấp 1", "Thiếu Nhi Cấp 2", "Thiếu Nhi Cấp 3",
      "Nghĩa Sĩ Cấp 1", "Nghĩa Sĩ Cấp 2", "Nghĩa Sĩ Cấp 3",
      "Hiệp Sĩ Cấp 1", "Hiệp Sĩ Cấp 2", "Hiệp Sĩ Trưởng Thành",
      "Huynh Trưởng", "Trợ Tá", "Huấn Luyện Viên"
    ];

    // Tạo một map để tra cứu chỉ số (thứ tự) của ngành
    const nganhIndexMap = new Map(nganhOrder.map((nganh, index) => [nganh, index]));

    // Sắp xếp dữ liệu
    allRegistrationsData.sort((a, b) => {
      const nganhA = a.nganh || ""; // Đảm bảo có giá trị để so sánh, tránh undefined
      const nganhB = b.nganh || "";

      const indexA = nganhIndexMap.has(nganhA) ? nganhIndexMap.get(nganhA) : Infinity; // Đưa ngành không xác định xuống cuối
      const indexB = nganhIndexMap.has(nganhB) ? nganhIndexMap.get(nganhB) : Infinity;

      if (indexA !== indexB) {
        return indexA - indexB;
      }

      // Nếu cùng ngành, sắp xếp theo tên gọi (first name)
      const tenGoiA = a.tenGoi || "";
      const tenGoiB = b.tenGoi || "";
      return tenGoiA.localeCompare(tenGoiB);
    });

    return allRegistrationsData;
  } catch (error) {
    console.error("Lỗi khi lấy tất cả dữ liệu đăng ký:", error);
    throw error;
  }
};

const auth = getAuth(app); // Khởi tạo Auth

export { db, auth }; // Export auth