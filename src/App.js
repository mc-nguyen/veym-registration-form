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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/health-info" element={<HealthInfoForm />} />
        <Route path="/waiver-release" element={<WaiverRelease />} />
        <Route path="/tntt-rules" element={<TNTTRules />} />
        <Route path="/preview-pdf" element={<PDFPreview />} />
        <Route path="/generate-pdf" element={<GeneratePDF />} />
        <Route path="/registration-adult" element={<RegistrationFormAdult />} />
        <Route path="/payment-adult" element={<PaymentAdult />} />
        <Route path="/health-info-adult" element={<HealthInfoFormAdult />} />
        <Route path="/waiver-release-adult" element={<WaiverReleaseAdult />} />
        <Route path="/tntt-rules-adult" element={<TNTTRulesAdult />} />
        <Route path="/generate-pdf-adult" element={<GeneratePDFAdult />} />
      </Routes>
    </Router>
  );
}

export default App;