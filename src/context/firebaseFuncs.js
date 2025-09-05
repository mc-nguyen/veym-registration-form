// src/context/firebaseFuncs.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, addDoc, collection, getDoc, doc, updateDoc, query, where, getDocs, deleteDoc, orderBy, setDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage"; // Import for storage operations

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
const auth = getAuth(app); // Khởi tạo Auth
const storage = getStorage(app); // Khởi tạo Storage

export const getContactMessages = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "contactMessages"));
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    // Sắp xếp theo timestamp giảm dần (tin mới nhất lên đầu)
    messages.sort((a, b) => b.timestamp - a.timestamp);
    return messages;
  } catch (e) {
    console.error("Error fetching contact messages: ", e);
    throw e;
  }
};

export const saveContactMessageToFirebase = async (messageData) => {
  try {
    const docRef = await addDoc(collection(db, "contactMessages"), {
      ...messageData,
      timestamp: Date.now()
    });
    console.log("Contact message written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding contact message: ", e);
    throw e;
  }
};

// Hàm lưu đăng ký mới vào Firebase
export const saveRegistrationToFirebase = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "registrations"), {
      registration: data, // Lưu trực tiếp formData ở cấp cao nhất
      status: 'pending', // Giữ trường status nếu bạn vẫn muốn dùng
      isPaid: false, // Thêm trường isPaid, mặc định là false
      timestamp: Date.now()
    });
    await addDoc(collection(db, "notifications"), {
      id: docRef.id,
      timestamp: Date.now(),
      content: "Registrations Data created"
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

export const updateRegistrationInFirebase = async (id, data) => {
  try {
    const docRef = doc(db, "registrations", id);
    await updateDoc(docRef, {
      registration: data,
      timestamp: Date.now() // Optional: update the timestamp
    });
    await addDoc(collection(db, "notifications"), {
      id: id,
      timestamp: Date.now(),
      content: "Registrations Data updated"
    });
    console.log("Registration document updated with ID: ", id);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

export const savePaymentToFirebase = async (id, data) => {
  try {
    const docRef = doc(db, 'registrations', id);
    await updateDoc(docRef, {
      payment: data,
      status: 'unpaid', // Cập nhật status
      isPaid: false // Đảm bảo isPaid vẫn là false ở bước này
    });
    await addDoc(collection(db, "notifications"), {
      id: docRef.id,
      timestamp: Date.now(),
      content: "Payment Data created or updated"
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const saveHealthInfoToFirebase = async (id, data) => {
  try {
    const docRef = doc(db, 'registrations', id);
    await updateDoc(docRef, { healthInfo: data });
    await addDoc(collection(db, "notifications"), {
      id: docRef.id,
      timestamp: Date.now(),
      content: "Health Information Data created or updated"
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const saveWaiverReleaseToFirebase = async (id, data) => {
  try {
    const docRef = doc(db, 'registrations', id);
    await updateDoc(docRef, { waiverRelease: data });
    await addDoc(collection(db, "notifications"), {
      id: docRef.id,
      timestamp: Date.now(),
      content: "Waiver Release Data created or updated"
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const saveTNTTRulesToFirebase = async (id, data) => {
  try {
    const docRef = doc(db, 'registrations', id);
    await updateDoc(docRef, {
      tnttRules: data
    });
    await addDoc(collection(db, "notifications"), {
      id: docRef.id,
      timestamp: Date.now(),
      content: "TNTT Rules Data created or updated"
    });
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const getDataById = async (docId) => {
  try {
    const docRef = doc(db, 'registrations', docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Nếu dữ liệu đăng ký ban đầu được lưu trong một trường 'registration', hãy trả về nó
      // Hoặc trả về toàn bộ doc.data() nếu bạn đã thay đổi cách lưu trữ
      return data;
    } else {
      console.log("Không tìm thấy tài liệu với ID:", docId);
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    throw error;
  }
};

export const saveParentSurvey = async (dataArray) => {
  try {
    const registrationData = {};
    dataArray.forEach((data, index) => {
      if (data !== undefined) {
        registrationData[index.toString()] = data;
      }
    });

    const docRef = await addDoc(collection(db, "parents"), registrationData);
    await addDoc(collection(db, "notifications"), {
      id: docRef.id,
      timestamp: Date.now(),
      content: "Parents Data created or updated"
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
}

// Hàm mới: Đánh dấu một đăng ký là đã trả tiền
export const markRegistrationAsPaid = async (registrationId) => {
  try {
    const registrationRef = doc(db, 'registrations', registrationId);
    await updateDoc(registrationRef, {
      isPaid: true,
      status: 'paid', // Cập nhật status nếu bạn vẫn sử dụng
      paymentDate: new Date().toISOString() // Lưu thời gian thanh toán
    });
    await addDoc(collection(db, "notifications"), {
      id: registrationId,
      timestamp: Date.now(),
      content: "Marked as paid"
    });
    console.log(`Registration ${registrationId} marked as paid.`);
  } catch (error) {
    console.error("Error marking registration as paid:", error);
    throw error;
  }
};

// Hàm để lấy tất cả các đơn đăng ký và làm phẳng dữ liệu
export const getAllRegistrationsData = async () => {
  try {
    const registrationsRef = collection(db, 'registrations');
    const querySnapshot = await getDocs(registrationsRef);

    let allRegistrationsData = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Phẳng hóa dữ liệu: Lấy các trường trực tiếp nếu không còn nested 'registration'
      // Nếu bạn vẫn có 'registration: {...}' thì cần điều chỉnh lại ở đây
      allRegistrationsData.push({
        id: doc.id,
        ...data, // Bao gồm tất cả các trường, kể cả isPaid
        fullName: [data.tenGoi, data.tenDem, data.ho].filter(Boolean).join(' ').trim(), // Tạo fullName từ các trường
        // Đảm bảo ngaySinh đúng định dạng nếu cần
      });
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
      const nganhA = a.nganh || "";
      const nganhB = b.nganh || "";

      const indexA = nganhIndexMap.has(nganhA) ? nganhIndexMap.get(nganhA) : Infinity;
      const indexB = nganhIndexMap.has(nganhB) ? nganhIndexMap.get(nganhB) : Infinity;

      if (indexA !== indexB) {
        return indexA - indexB;
      }

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

export const getAllRegistrations = async () => {
  try {
    const q = query(collection(db, 'registrations')); // Lấy tất cả tài liệu trong collection 'registrations'
    const querySnapshot = await getDocs(q);

    const allRegistrations = [];
    querySnapshot.forEach((doc) => {
      allRegistrations.push({ id: doc.id, ...doc.data() });
    });
    return allRegistrations;
  } catch (error) {
    console.error("Error fetching all registrations:", error);
    throw error;
  }
};

// Hàm mới: Cập nhật trạng thái thanh toán (Paid/Unpaid)
export const updatePaymentStatus = async (id, isPaid) => {
  try {
    const registrationRef = doc(db, 'registrations', id);
    await updateDoc(registrationRef, {
      isPaid: isPaid,
      status: isPaid ? 'paid' : 'unpaid' // Cập nhật cả trường status
    });
    await addDoc(collection(db, "notifications"), {
      id: id,
      timestamp: Date.now(),
      content: `Payment status updated to ${isPaid ? 'Paid' : 'Unpaid'}.`
    });
    console.log(`Registration ${id} payment status updated to ${isPaid ? 'Paid' : 'Unpaid'}.`);
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

// Hàm mới: Xóa một đơn đăng ký
export const deleteRegistration = async (id, signatureUrl) => {
  try {
    // Xóa tài liệu Firestore
    await deleteDoc(doc(db, 'registrations', id));
    console.log("Registration document deleted successfully for ID:", id);
    await addDoc(collection(db, "notifications"), {
      id: id,
      timestamp: Date.now(),
      content: "Form is deleted!"
    });

    // Nếu có URL chữ ký và chữ ký được lưu trong Firebase Storage, xóa nó
    if (signatureUrl && signatureUrl.startsWith('gs://')) { // Kiểm tra nếu là URL Storage
      const signatureRef = ref(storage, signatureUrl);
      await deleteObject(signatureRef);
      console.log("Signature image deleted successfully for ID:", id);
    } else if (signatureUrl && typeof signatureUrl === 'string' && signatureUrl.startsWith('data:')) {
      // Nếu chữ ký là base64 data URL, không cần xóa từ storage
      console.log("Signature is base64 data, no file to delete from storage.");
    }

  } catch (error) {
    console.error("Error deleting registration or signature:", error);
    throw error;
  }
};

// Hàm ẩn để xóa các dữ liệu đăng ký cũ hơn một tuần
export const cleanOldUnpaidRegistrations = async () => {
  try {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 ngày trước
    console.log(`Starting cleanup: Deleting UNPAID registrations older than ${new Date(oneWeekAgo).toLocaleString()}`);

    // Truy vấn các tài liệu có timestamp cũ hơn một tuần VÀ isPaid là false
    const q = query(
      collection(db, 'registrations'),
      where('timestamp', '<', oneWeekAgo),
      where('isPaid', '==', false) // THÊM ĐIỀU KIỆN NÀY
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No old UNPAID registrations found to delete.");
      return;
    }

    const deletePromises = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;
      deletePromises.push(deleteRegistration(id, data.signature));
      console.log(`Scheduling deletion for UNPAID registration ID: ${id}`);
    });

    await Promise.all(deletePromises);
    console.log(`Successfully deleted ${deletePromises.length} old UNPAID registrations.`);
  } catch (error) {
    console.error("Error during old UNPAID registrations cleanup:", error);
    throw error;
  }
};

export const getRegistrationByEmail = async (email) => {
  try {
    const registrationsRef = collection(db, 'registrations');

    // Tạo một query để tìm kiếm theo trường email nằm trong sub-field 'registration'
    const q = query(registrationsRef, where('registration.email', '==', email));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Không tìm thấy người dùng nào với email này.");
      return null;
    }

    // Lấy dữ liệu của người dùng đầu tiên tìm thấy
    const doc = querySnapshot.docs[0];
    const data = doc.data(); // Lấy dữ liệu từ sub-field 'registration'

    return {
      id: doc.id,
      ...data
    };

  } catch (error) {
    console.error("Lỗi khi tìm kiếm người dùng theo email:", error);
    throw error;
  }
};

export const getUnpaidRegistrations = async () => {
  try {
    const q = query(collection(db, 'registrations'), where('isPaid', '==', false));
    const querySnapshot = await getDocs(q);

    const unpaidRegistrations = [];
    querySnapshot.forEach((doc) => {
      unpaidRegistrations.push({ id: doc.id, ...doc.data() });
    });
    return unpaidRegistrations;
  } catch (error) {
    console.error("Error fetching unpaid registrations:", error);
    throw error;
  }
};

export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Lưu thời gian đăng nhập vào localStorage
    localStorage.setItem('lastLoginTime', Date.now());
    return user;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    throw error;
  }
};

export const getNotifications = async () => {
  try {
    const notificationsRef = collection(db, "notifications");

    // Tạo truy vấn để lấy tất cả tài liệu và sắp xếp theo timestamp giảm dần
    const q = query(notificationsRef, orderBy("timestamp", "desc"));

    const querySnapshot = await getDocs(q);
    const notifications = [];

    querySnapshot.forEach((doc) => {
      // Đẩy dữ liệu của từng tài liệu vào mảng
      notifications.push({ id: doc.id, ...doc.data() });
    });

    return notifications;
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error);
    throw error;
  }
};

export const getSettingsFromFirebase = async () => {
    try {
        const docRef = doc(db, "settings", "generalSettings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No settings document found. Returning default values.");
            return {
                registrationFee: 50,
                uniformCost: 25,
                skortCost: 25,
                scarfCost: 10,
                committee: []
            };
        }
    } catch (e) {
        console.error("Error getting settings:", e);
        return null;
    }
};

// Hàm lưu cài đặt vào Firestore
export const saveSettingsToFirebase = async (settingsData) => {
    try {
        await setDoc(doc(db, "settings", "generalSettings"), settingsData);
        console.log("Settings saved successfully!");
        return true;
    } catch (e) {
        console.error("Error saving settings:", e);
        throw e;
    }
};

export const updateSettings = async (newSettings) => {
    try {
        await setDoc(doc(db, 'settings', 'app_settings'), newSettings, { merge: true });
        console.log("Cài đặt đã được cập nhật thành công.");
    } catch (e) {
        console.error("Lỗi khi cập nhật cài đặt:", e);
    }
};

// Hàm lấy danh sách email bị chặn
export const getEmailBlacklist = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "emailBlacklist"));
    const blacklist = [];
    querySnapshot.forEach((doc) => {
      blacklist.push(doc.data().email);
    });
    return blacklist;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách email đen:", error);
    return [];
  }
};

// Hàm lấy danh sách số điện thoại bị chặn
export const getPhoneBlacklist = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "phoneBlacklist"));
    const blacklist = [];
    querySnapshot.forEach((doc) => {
      blacklist.push(doc.data().phone);
    });
    return blacklist;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách số điện thoại đen:", error);
    return [];
  }
};

// Hàm thêm email vào danh sách đen
export const addEmailToBlacklist = async (email) => {
  try {
    await addDoc(collection(db, "emailBlacklist"), { email: email });
    console.log("Email added to blacklist successfully!");
    return true;
  } catch (e) {
    console.error("Error adding email to blacklist:", e);
    throw e;
  }
};

// Hàm xóa email khỏi danh sách đen
export const removeEmailFromBlacklist = async (docId) => {
  try {
    await deleteDoc(doc(db, "emailBlacklist", docId));
    console.log("Email removed from blacklist successfully!");
    return true;
  } catch (e) {
    console.error("Error removing email from blacklist:", e);
    throw e;
  }
};

// Hàm thêm số điện thoại vào danh sách đen
export const addPhoneToBlacklist = async (phone) => {
  try {
    await addDoc(collection(db, "phoneBlacklist"), { phone: phone });
    console.log("Phone number added to blacklist successfully!");
    return true;
  } catch (e) {
    console.error("Error adding phone number to blacklist:", e);
    throw e;
  }
};

// Hàm xóa số điện thoại khỏi danh sách đen
export const removePhoneFromBlacklist = async (docId) => {
  try {
    await deleteDoc(doc(db, "phoneBlacklist", docId));
    console.log("Phone number removed from blacklist successfully!");
    return true;
  } catch (e) {
    console.error("Error removing phone number from blacklist:", e);
    throw e;
  }
};

export { db, auth, storage }; // Export auth và storage