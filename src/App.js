import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ExportDataToExcel from "./components/excel/ExportDataToExcel";
import ParentDataTable from "./components/parent-survey-form/ParentDataTable";
import ProcessingPage from "./components/processing/ProcessingPage";
import AdminRegistrationList from "./admin/AdminRegistrationList";

function App() {
  const currentPathname = window.location.pathname;
  const isAdminOrPreview = currentPathname.includes('/admin/') || currentPathname.includes('pdf');

  return (
    <div>
      {/* Chỉ hiển thị LanguageSwitcher nếu không phải trang admin hoặc preview-pdf */}
      {!isAdminOrPreview ? <LanguageSwitcher /> : <></>}

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/preview-pdf" element={<PDFPreview />} />
          <Route path="/processing" element={<ProcessingPage />} />

          {/* <Route path="/email-search" element={<EmailSearch />} /> */}
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/health-info" element={<HealthInfoForm />} />
          <Route path="/waiver-release" element={<WaiverRelease />} />
          <Route path="/tntt-rules" element={<TNTTRules />} />
          <Route path="/parent-survey" element={<ParentSurveyForm />} />
          <Route path="/generate-pdf" element={<GeneratePDF />} />

          {/* <Route path="/email-search-adult" element={<EmailSearchAdult />} /> */}
          <Route path="/registration-adult" element={<RegistrationFormAdult />} />
          <Route path="/payment-adult" element={<PaymentAdult />} />
          <Route path="/health-info-adult" element={<HealthInfoFormAdult />} />
          <Route path="/waiver-release-adult" element={<WaiverReleaseAdult />} />
          <Route path="/tntt-rules-adult" element={<TNTTRulesAdult />} />
          <Route path="/generate-pdf-adult" element={<GeneratePDFAdult />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/excel" element={<ExportDataToExcel />} />
          <Route path="/admin/parents" element={<ParentDataTable />} />
<<<<<<< HEAD
=======
          <Route path="/admin/paid" element={<AdminPaidChange />} />
>>>>>>> a6df68639482dd4e5c1bc13043c11e5925c213ca
          <Route path="/admin/registrations" element={<AdminRegistrationList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
