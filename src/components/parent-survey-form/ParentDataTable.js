import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
// Đảm bảo đường dẫn này đúng với file firebaseFuncs.js của bạn
import { db } from '../../context/firebaseFuncs'; 

const ParentDataTable = () => {
  const [parentDocuments, setParentDocuments] = useState([]); // Đổi tên để rõ ràng hơn: đây là các document từ collection "parents"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ánh xạ đơn giản cho tên hoạt động tình nguyện
  const volunteerActivitiesMap = {
    assistant: "Trợ lý",
    cookChildren: "Nấu ăn cho trẻ em",
    teaching: "Giảng dạy",
    finance: "Tài chính",
    liturgy: "Phụng vụ",
    medical: "Y tế",
    canHelpFoodService: "Giúp phục vụ thức ăn",
    canHelpFoodPurchase: "Giúp mua thực phẩm",
  };

  useEffect(() => {
    const fetchParentDocuments = async () => {
      try {
        // Lấy dữ liệu từ collection "parents"
        const querySnapshot = await getDocs(collection(db, "parents"));
        const fetchedDocs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data() // Lưu toàn bộ dữ liệu của document
        }));
        setParentDocuments(fetchedDocs);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu phụ huynh: ", err);
        setError("Không thể tải dữ liệu để test.");
      } finally {
        setLoading(false);
      }
    };

    fetchParentDocuments();
  }, []); // [] đảm bảo useEffect chỉ chạy một lần khi component được mount

  if (loading) {
    return <div style={{ padding: '10px', textAlign: 'center' }}>Đang tải dữ liệu phụ huynh để test...</div>;
  }

  if (error) {
    return <div style={{ padding: '10px', color: 'red', textAlign: 'center' }}>Lỗi: {error}</div>;
  }

  if (!parentDocuments || parentDocuments.length === 0) {
    return <div style={{ padding: '10px', textAlign: 'center' }}>Không có tài liệu phụ huynh nào trong Firestore.</div>;
  }

  return (
    <div style={{ padding: '10px' }}>
      <h3>Dữ liệu phụ huynh</h3>
      {parentDocuments.map((docContainer) => {
        const documentData = docContainer.data; // Đây là đối tượng { "0": {...}, "1": {...} }
        const parentEntries = Object.entries(documentData)
          .filter(([key]) => !isNaN(parseInt(key)) && key !== 'length') // Lọc chỉ lấy các khóa số (0, 1, 2...)
          .sort(([keyA], [keyB]) => parseInt(keyA) - parseInt(keyB)); // Sắp xếp lại theo thứ tự số

        if (parentEntries.length === 0) {
          return (
            <div key={docContainer.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
              <p>Document ID: {docContainer.id}</p>
              <p>Không có dữ liệu phụ huynh hợp lệ trong document này.</p>
            </div>
          );
        }

        return (
          <div key={docContainer.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
            <h4>Document ID: {docContainer.id}</h4>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th>#</th> {/* Index của phụ huynh trong cùng một document */}
                  <th>Tên Phụ Huynh</th>
                  <th>Email</th>
                  <th>Điện Thoại</th>
                  <th>Ghi Chú</th>
                  <th>Hoạt Động Tình Nguyện</th>
                </tr>
              </thead>
              <tbody>
                {parentEntries.map(([key, parentData]) => {
                  const activityVolunteer = parentData.activityVolunteer || {};

                  const trueActivities = Object.keys(activityVolunteer)
                    .filter(actKey => activityVolunteer[actKey] === true)
                    .map(actKey => volunteerActivitiesMap[actKey] || actKey);

                  return (
                    <tr key={`${docContainer.id}-${key}`}>
                      <td style={{ padding: '8px' }}>{parseInt(key) + 1}</td>
                      <td style={{ padding: '8px' }}>{parentData.parentName || 'N/A'}</td>
                      <td style={{ padding: '8px' }}>{parentData.parentEmail || 'N/A'}</td>
                      <td style={{ padding: '8px' }}>{parentData.parentPhone || 'N/A'}</td>
                      <td style={{ padding: '8px' }}>{parentData.otherNotes || 'Không có'}</td>
                      <td style={{ padding: '8px' }}>
                        {trueActivities.length > 0 ? trueActivities.join(', ') : 'Không tham gia'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default ParentDataTable;