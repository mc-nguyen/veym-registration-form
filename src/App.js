import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore'; // Thêm onSnapshot và doc
import { db } from './context/firebaseFuncs'; // Thêm db

import RegistrationForm from "./components/registration-form/RegistrationForm";
import Payment from "./components/payment/Payment";
import HealthInfoForm from "./components/health-info/HealthInfoForm";
import WaiverRelease from "./components/waiver-release/WaiverRelease";
import TNTTRules from "./components/tntt-rules/TNTTRules";
import HomePage from './pages/HomePage';
import GuidePage from './pages/GuidePage';
import PDFPreview from "./pages/PDFPreview";
import GeneratePDF from "./components/GeneratePDF";
import RegistrationFormAdult from "./components/registration-form/RegistrationFormAdult";
import PaymentAdult from "./components/payment/PaymentAdult";
import HealthInfoFormAdult from "./components/health-info/HealthInfoFormAdult";
import WaiverReleaseAdult from "./components/waiver-release/WaiverReleaseAdult";
import TNTTRulesAdult from "./components/tntt-rules/TNTTRulesAdult";
import GeneratePDFAdult from "./components/GeneratePDFAdult";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import LanguageSwitcher from "./components/LanguageSwitcher";
import ParentSurveyForm from "./components/parent-survey-form/ParentSurveyForm";
import ParentDataTable from "./components/parent-survey-form/ParentDataTable";
import ProcessingPage from "./components/processing/ProcessingPage";
import AdminRegistrationList from "./admin/AdminRegistrationList";
import AdminPaidRegistrationList from "./admin/AdminPaidRegistrationList";
import SearchByEmail from "./components/SearchByEmail";
import Complete from "./components/processing/Complete";
import AdminUnpaidRegistrationList from "./admin/AdminUnpaidRegistrationList";
import HowToPay from "./pages/HowToPay";
import ProtectedRoute from "./admin/ProtectedRoute";
import ContactUs from "./pages/ContactUs";
import AdminContactMessagesList from "./admin/AdminContactMessagesList";
import AdminNotificationsPage from "./admin/AdminNotificationsPage";
import AdminSettings from "./admin/AdminSettings";
import MaintenancePage from "./pages/MaintenancePage";

function App() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);

  // Lắng nghe trạng thái bảo trì từ Firebase theo thời gian thực
  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'app_settings');
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsMaintenanceMode(data.isMaintenanceMode || false);
      }
      setLoadingMaintenance(false);
    }, (err) => {
      console.error("Lỗi khi lắng nghe cài đặt:", err);
      setLoadingMaintenance(false);
    });
    return () => unsubscribe();
  }, []);

  // Xác định các trang admin hoặc trang xem PDF không cần LanguageSwitcher
  const currentPathname = window.location.pathname;
  const isSpecialPage = currentPathname.startsWith('/admin') || currentPathname.includes('pdf') || currentPathname.startsWith('/maintenance');

  // Điều kiện mới để hiển thị LanguageSwitcher
  const showLanguageSwitcher = !isMaintenanceMode && !isSpecialPage;

  return (
    <div>
      {/* Chỉ hiển thị LanguageSwitcher nếu không phải trang admin hoặc preview-pdf */}
      {showLanguageSwitcher && !loadingMaintenance && <LanguageSwitcher />}

      <Router>
        <Routes>
          <Route path="/maintenance" element={<MaintenancePage />} />

          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/guide" element={<ProtectedRoute><GuidePage /></ProtectedRoute>} />
          <Route path="/preview-pdf" element={<ProtectedRoute><PDFPreview /></ProtectedRoute>} />
          <Route path="/processing" element={<ProtectedRoute><ProcessingPage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchByEmail /></ProtectedRoute>} />
          <Route path="/complete" element={<ProtectedRoute><Complete /></ProtectedRoute>} />
          <Route path="/how-to-pay" element={<ProtectedRoute><HowToPay /></ProtectedRoute>} />
          <Route path="/contact-us" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />

          <Route path="/registration" element={<ProtectedRoute><RegistrationForm /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/health-info" element={<ProtectedRoute><HealthInfoForm /></ProtectedRoute>} />
          <Route path="/waiver-release" element={<ProtectedRoute><WaiverRelease /></ProtectedRoute>} />
          <Route path="/tntt-rules" element={<ProtectedRoute><TNTTRules /></ProtectedRoute>} />
          <Route path="/parent-survey" element={<ProtectedRoute><ParentSurveyForm /></ProtectedRoute>} />
          <Route path="/generate-pdf/:id" element={<GeneratePDF />} />

          <Route path="/registration-adult" element={<ProtectedRoute><RegistrationFormAdult /></ProtectedRoute>} />
          <Route path="/payment-adult" element={<ProtectedRoute><PaymentAdult /></ProtectedRoute>} />
          <Route path="/health-info-adult" element={<ProtectedRoute><HealthInfoFormAdult /></ProtectedRoute>} />
          <Route path="/waiver-release-adult" element={<ProtectedRoute><WaiverReleaseAdult /></ProtectedRoute>} />
          <Route path="/tntt-rules-adult" element={<ProtectedRoute><TNTTRulesAdult /></ProtectedRoute>} />
          <Route path="/generate-pdf-adult/:id" element={<GeneratePDFAdult />} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/parents" element={<ProtectedRoute><ParentDataTable /></ProtectedRoute>} />
          <Route path="/admin/registrations" element={<ProtectedRoute><AdminRegistrationList /></ProtectedRoute>} />
          <Route path="/admin/paid" element={<ProtectedRoute><AdminPaidRegistrationList /></ProtectedRoute>} />
          <Route path="/admin/unpaid" element={<ProtectedRoute><AdminUnpaidRegistrationList /></ProtectedRoute>} />
          <Route path="/admin/contact-messages" element={<ProtectedRoute><AdminContactMessagesList /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute><AdminNotificationsPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
