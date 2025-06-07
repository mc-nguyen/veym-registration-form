// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection, getDoc, doc, updateDoc } from "firebase/firestore";
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
  const confirmationCode = generateRandomConfirmationCode();
  try {
    const docRef = await addDoc(collection(db, "registrations"), {
      confirmationCode: confirmationCode,
      registration: data
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

function generateRandomConfirmationCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const checkConfirmationCode = async (docId, codeToCheck) => {
  try {
    const docRef = doc(db, 'registrations', docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const storedCode = data.confirmationCode;

      if (storedCode && storedCode === codeToCheck) {
        console.log("Mã xác nhận trùng khớp!");
        return true;
      } else {
        console.log("Mã xác nhận không trùng khớp hoặc không tồn tại trong tài liệu.");
        return false;
      }
    } else {
      console.log("Không tìm thấy tài liệu với ID:", docId);
      return false;
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra mã xác nhận:", error);
    throw error; // Ném lỗi để component gọi có thể bắt và xử lý
  }
};

export const savePaymentToFirebase = async (id, data) => {
  try {
    const docRef = doc(db, 'registrations', id);
    await updateDoc(docRef, {payment: data});
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const saveHealthInfoToFirebase = async (id, data) => {
  try {
    const docRef = doc(db, 'registrations', id);
    await updateDoc(docRef, {healthInfo: data});
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const saveWaiverReleaseToFirebase = async (id, data) => {
  try {
    const docRef = doc(db, 'registrations', id);
    await updateDoc(docRef, {waiverRelease: data});
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const saveTNTTRulesToFirebase = async (id, data) => {
  try {
    const docRef = doc(db, 'registrations', id);
    await updateDoc(docRef, {tnttRules: data});
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

const auth = getAuth(app); // Khởi tạo Auth

export { db, auth }; // Export auth