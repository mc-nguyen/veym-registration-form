import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDataById,
  updateRegistrationInFirebase,
} from "../../context/firebaseFuncs";
import { useLanguage } from "../../LanguageContext";
import SignatureCanvas from "../../components/signature/SignatureCanvas";
import "./EditForm.css";

const EditFormAdult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { translate: t } = useLanguage();

  const [formData, setFormData] = useState({
    registration: {},
    healthInfo: {},
    waiverRelease: {},
    tnttRules: {},
    payment: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [signatureData, setSignatureData] = useState(null);
  const [waiverSignatureData, setWaiverSignatureData] = useState(null);
  const [tnttSignatureData, setTnttSignatureData] = useState(null);
  const [payment, setPayment] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Không tìm thấy ID.");
        setLoading(false);
        return;
      }
      try {
        const data = await getDataById(id);
        if (data.payment) {
          setPayment([
            {
              quantity: data.payment[1],
              name: t("paymentPage.feeItems.annualFee"), // Dịch tên khoản phí
              amount: data.payment[1] * 50,
            },
            {
              quantity: data.payment[2],
              name: t("paymentPage.feeItems.uniformShirt"), // Dịch tên khoản phí
              amount: data.payment[2] * 25,
            },
            {
              quantity: data.payment[3],
              name: t("paymentPage.feeItems.uniformSkort"), // Dịch tên khoản phí
              amount: data.payment[3] * 25,
            },
            {
              quantity: data.payment[4],
              name: t("paymentPage.feeItems.tnttScarf"), // Dịch tên khoản phí
              amount: data.payment[4] * 10,
            },
          ]);
          setTotal(
            data.payment[1] * 50 +
              data.payment[2] * 25 +
              data.payment[3] * 25 +
              data.payment[4] * 10
          );
        }
        if (data) {
          setFormData({
            registration: data.registration || {},
            healthInfo: data.healthInfo || {},
            waiverRelease: data.waiverRelease || {},
            tnttRules: data.tnttRules || {},
            payment: data.payment || {},
          });
          setSignatureData(data.registration?.studentSignature || null);
          setWaiverSignatureData(data.waiverRelease?.signature || null);
          setTnttSignatureData(data.tnttRules?.signature || null);
        } else {
          setError("Không tìm thấy dữ liệu với ID này.");
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, t]);

  const handleChange = (e, formName) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [formName]: {
        ...prev[formName],
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updatedData = {
        ...formData,
        registration: {
          ...formData.registration,
          signature: signatureData,
        },
        waiverRelease: {
          ...formData.waiverRelease,
          signature: waiverSignatureData,
        },
        tnttRules: {
          ...formData.tnttRules,
          signature: tnttSignatureData,
        },
      };
      await updateRegistrationInFirebase(id, updatedData);
      alert(t("editForm.updateSuccess"));
      navigate("/complete");
    } catch (err) {
      console.error("Lỗi khi cập nhật dữ liệu:", err);
      setError("Lỗi khi cập nhật dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-state">{t("editForm.loading")}</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        {t("editForm.error")} {error}
      </div>
    );
  }

  return (
    <div className="edit-form-container">
      <h1>{t("editForm.title")}</h1>

      {/* Registration Form Section */}
      <div className="form-section">
        <h2>{t("registrationFormAdult.memberInfo")}</h2>
        <div className="form-group">
          <label>{t("registrationFormAdult.saintName")}</label>
          <input
            type="text"
            name="tenThanh"
            value={formData.registration.tenThanh || ""}
            onChange={(e) => handleChange(e, "registration")}
          />
        </div>
        <div className="form-group">
          <label>{t("registrationFormAdult.lastName")}</label>
          <input
            type="text"
            name="ho"
            value={formData.registration.ho || ""}
            onChange={(e) => handleChange(e, "registration")}
          />
        </div>
        <div className="form-group">
          <label>{t("registrationFormAdult.middleName")}</label>
          <input
            type="text"
            name="tenDem"
            value={formData.registration.tenDem || ""}
            onChange={(e) => handleChange(e, "registration")}
          />
        </div>
        <div className="form-group">
          <label>{t("registrationFormAdult.firstName")}</label>
          <input
            type="text"
            name="tenGoi"
            value={formData.registration.tenGoi || ""}
            onChange={(e) => handleChange(e, "registration")}
          />
        </div>
        <div className="form-group">
          <label>{t("registrationFormAdult.address")}</label>
          <input
            type="text"
            name="diaChi"
            value={formData.registration.diaChi || ""}
            onChange={(e) => handleChange(e, "registration")}
          />
        </div>
        <div className="form-group">
          <label>{t("registrationFormAdult.phoneHome")}</label>
          <input
            type="tel"
            name="phoneHome"
            value={formData.registration.phoneHome || ""}
            onChange={(e) => handleChange(e, "registration")}
          />
        </div>
        <div className="form-group">
          <label>{t("registrationFormAdult.phoneCell")}</label>
          <input
            type="tel"
            name="phoneCell"
            value={formData.registration.phoneCell || ""}
            onChange={(e) => handleChange(e, "registration")}
          />
        </div>
        <div className="form-group">
          <label>{t("registrationFormAdult.phoneWork")}</label>
          <input
            type="tel"
            name="phoneWork"
            value={formData.registration.phoneWork || ""}
            onChange={(e) => handleChange(e, "registration")}
          />
        </div>
        <div className="form-group">
          <label>{t("registrationFormAdult.phoneEmergency")}</label>
          <input
            type="tel"
            name="phoneEmergency"
            value={formData.registration.phoneEmergency || ""}
            onChange={(e) => handleChange(e, "registration")}
          />
        </div>
        <div className="form-group">
          <label>{t("registrationFormAdult.email")}</label>
          <input
            type="email"
            name="email"
            value={formData.registration.email || ""}
            onChange={(e) => handleChange(e, "registration")}
          />
        </div>
        <div className="form-group">
          <label>{t("registrationFormAdult.birthDate")}</label>
          <input
            type="date"
            name="ngaySinh"
            value={formData.registration.ngaySinh || ""}
            onChange={(e) => handleChange(e, "registration")}
          />
        </div>
        <div className="form-group">
          <label>{t("registrationFormAdult.branchTitle")}</label>
          <input
            type="text"
            name="nganh"
            value={formData.registration.nganh || ""}
            disabled
          />
        </div>
        <div className="form-group signature-area">
          <div className="consent-text">
            <h3>{t("registrationFormAdult.tnttCommitment")}</h3>{" "}
            {/* New title for student signature */}
            <label>{t("registrationFormAdult.commitmentText")}</label>{" "}
            {/* New consent text for student */}
          </div>
          <label>
            {t("registrationFormAdult.signatureLabel")}{" "}
            {new Date().toLocaleDateString("vi-VN")}
          </label>
          <SignatureCanvas
            onSave={(data) => setSignatureData(data)}
            onClear={() => setSignatureData(null)}
            dataImage={signatureData}
          />
        </div>
      </div>

      {/* Health Info Form Section */}
      <div className="form-section">
        <h2>{t("healthInfoForm.title")}</h2>
        <div className="form-group">
          <label>{t("healthInfoForm.lastName")}</label>
          <input
            type="text"
            name="lastName"
            value={formData.healthInfo.lastName || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.firstName")}</label>
          <input
            type="text"
            name="firstName"
            value={formData.healthInfo.firstName || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.birthDate")}</label>
          <input
            type="date"
            name="birthDate"
            value={formData.healthInfo.birthDate || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.gender")}</label>
          <select
            name="gender"
            value={formData.healthInfo.gender || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          >
            <option value=""></option>
            <option value="Nam">{t("healthInfoForm.male")}</option>
            <option value="Nữ">{t("healthInfoForm.female")}</option>
          </select>
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.doctorName")}</label>
          <input
            type="text"
            name="doctor"
            value={formData.healthInfo.doctor || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.doctorPhone")}</label>
          <input
            type="tel"
            name="doctorPhone"
            value={formData.healthInfo.doctorPhone || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.insuranceCompany")}</label>
          <input
            type="text"
            name="insuranceCompany"
            value={formData.healthInfo.insuranceCompany || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.insuranceId")}</label>
          <input
            type="text"
            name="insuranceId"
            value={formData.healthInfo.insuranceId || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.insuranceGroup")}</label>
          <input
            type="text"
            name="insuranceGroup"
            value={formData.healthInfo.insuranceGroup || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.cardholderName")}</label>
          <input
            type="text"
            name="cardholderName"
            value={formData.healthInfo.cardholderName || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.allergies")}</label>
          <textarea
            name="allergies"
            value={formData.healthInfo.allergies || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.medicalConcerns")}</label>
          <textarea
            name="medicalConcerns"
            value={formData.healthInfo.medicalConcerns || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.physicalRestrictions")}</label>
          <textarea
            name="physicalRestrictions"
            value={formData.healthInfo.physicalRestrictions || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.emergencyContact")}</label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.healthInfo.emergencyContact || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.emergencyPhone")}</label>
          <input
            type="tel"
            name="emergencyPhone"
            value={formData.healthInfo.emergencyPhone || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
        <div className="form-group">
          <label>{t("healthInfoForm.relationship")}</label>
          <input
            type="text"
            name="emergencyRelationship"
            value={formData.healthInfo.emergencyRelationship || ""}
            onChange={(e) => handleChange(e, "healthInfo")}
          />
        </div>
      </div>

      {/* Waiver & Release Section */}
      <div className="form-section">
        <h2>{t("waiverRelease.title")}</h2>

        <div className="waiver-content">
          <p>
            {t("waiverRelease.waiver.head1", {
              fullname:
                "________" + formData.waiverRelease.fullName + "________",
            })}{" "}
            <br />
            <br />
            {t("waiverRelease.waiver.head2")}
            <br />
            <br />
            {t("waiverRelease.waiver.head3", {
              fullname:
                "________" + formData.waiverRelease.fullName + "________",
            })}{" "}
            <br />
          </p>

          {/* All numbered points with inputs */}

          <div className="waiver-section">
            <p>
              <strong>1.</strong> {t("waiverRelease.waiver.w1")}
              <br />
              <InitialInput
                name="initial1"
                value={formData.waiverRelease.initial1}
                onChange={handleChange}
              />{" "}
              (please initial for concurrence)
            </p>
          </div>

          <div className="waiver-section">
            <p>
              <strong>2.</strong> {t("waiverRelease.waiver.w2")}
              <br />
              <InitialInput
                name="initial2"
                value={formData.waiverRelease.initial2}
                onChange={handleChange}
              />{" "}
              (please initial for concurrence)
            </p>
          </div>

          {t("waiverRelease.waiver.head4")}
          <br />

          <div className="waiver-section">
            <p>
              <strong>3.</strong> {t("waiverRelease.waiver.w3")}
              <br />
              <InitialInput
                name="initial3"
                value={formData.waiverRelease.initial3}
                onChange={handleChange}
              />{" "}
              (please initial for concurrence)
            </p>
          </div>

          <div className="waiver-section">
            <p>
              <strong>4.</strong> {t("waiverRelease.waiver.w4")}
              <br />
              <InitialInput
                name="initial4"
                value={formData.waiverRelease.initial4}
                onChange={handleChange}
              />{" "}
              (please initial for concurrence)
            </p>
          </div>

          <div className="waiver-section">
            <p>
              <strong>5.</strong> {t("waiverRelease.waiver.w5")}
              <br />
              <InitialInput
                name="initial5"
                value={formData.waiverRelease.initial5}
                onChange={handleChange}
              />{" "}
              (please initial for concurrence)
            </p>
          </div>

          <div className="waiver-section">
            <p>
              <strong>6.</strong> {t("waiverRelease.waiver.w6")}
              <br />
              <InitialInput
                name="initial6"
                value={formData.waiverRelease.initial6}
                onChange={handleChange}
              />{" "}
              (please initial for concurrence)
            </p>
          </div>

          <div className="waiver-section">
            <p>
              <div
                dangerouslySetInnerHTML={{
                  __html: t("waiverRelease.waiver.w7"),
                }}
              ></div>
              <br />
              <InitialInput
                name="initial7"
                value={formData.waiverRelease.initial7}
                onChange={handleChange}
              />{" "}
              (please initial for concurrence)
            </p>
          </div>

          <div className="waiver-section">
            <p>
              <strong>8.</strong> {t("waiverRelease.waiver.w8")}
              <br />
              <InitialInput
                name="initial8"
                value={formData.waiverRelease.initial8}
                onChange={handleChange}
              />{" "}
              (please initial for concurrence)
            </p>
          </div>

          {/* Points 3-8 follow same pattern */}
          {/* ... */}

          <div className="waiver-section">
            <p>
              ● {t("waiverRelease.waiver.w9")}
              <InitialInput
                name="initial9"
                value={formData.waiverRelease.initial9}
                onChange={handleChange}
              />{" "}
              (please initial for concurrence)
            </p>
          </div>

          <div className="waiver-section">
            <p
              dangerouslySetInnerHTML={{
                __html: t("waiverRelease.waiver.w10"),
              }}
            ></p>
          </div>

          <div className="waiver-section">
            <p>
              ● {t("waiverRelease.waiver.w11")}
              <br />
            </p>
          </div>

          <div className="waiver-section">
            <p>
              ● {t("waiverRelease.waiver.w12")}
              <br />
            </p>
          </div>

          <div className="signature-section">
            <strong>
              {t("waiverRelease.waiver.foot")}
              <br />
            </strong>
          </div>
        </div>

        <div className="form-group">
          <label>{t("waiverRelease.printedName")}</label>
          <input
            type="text"
            name="printedName"
            value={formData.waiverRelease.printedName || ""}
            onChange={(e) => handleChange(e, "waiverRelease")}
          />
        </div>
        <div className="form-group">
          <label>{t("waiverRelease.date")}</label>
          <input
            type="text"
            name="date"
            value={formData.waiverRelease.date || ""}
            onChange={(e) => handleChange(e, "waiverRelease")}
            readOnly
          />
        </div>
        <div className="form-group signature-area">
          <label>{t("waiverRelease.signature")}</label>
          <SignatureCanvas
            onSave={(data) => setWaiverSignatureData(data)}
            onClear={() => setWaiverSignatureData(null)}
            dataImage={waiverSignatureData}
          />
        </div>
      </div>

      {/* TNTT Rules Section */}
      <div className="form-section">
        <h2>{t("tnttRules.title")}</h2>
        <div className="tntt-rules-content">
          <ol>
            <li>{t("tnttRules.rules.rule1")}</li>
            <li>{t("tnttRules.rules.rule2")}</li>
            <li>{t("tnttRules.rules.rule3")}</li>
            <li>{t("tnttRules.rules.rule4")}</li>
            <li>{t("tnttRules.rules.rule5")}</li>
            <li>{t("tnttRules.rules.rule6")}</li>
            <li>{t("tnttRules.rules.rule7")}</li>
            <li>{t("tnttRules.rules.rule8")}</li>
            <li>{t("tnttRules.rules.rule9")}</li>
            <li>{t("tnttRules.rules.rule10")}</li>
          </ol>
          <p style={{ textDecorationLine: "underline" }}>
            {t("tnttRules.rules.consequences")}
          </p>
          <ol>
            <li>{t("tnttRules.rules.consequence1")}</li>
            <li>{t("tnttRules.rules.consequence2")}</li>
            <li>{t("tnttRules.rules.consequence3")}</li>
          </ol>
        </div>
        <div className="form-group">
          <label>{t("tnttRules.memberName")}</label>
          <input
            type="text"
            name="memberName"
            value={formData.tnttRules.memberName || ""}
            onChange={(e) => handleChange(e, "tnttRules")}
          />
        </div>
        <div className="form-group">
          <label>{t("tnttRules.date")}</label>
          <input
            type="text"
            name="date"
            value={formData.tnttRules.date || ""}
            onChange={(e) => handleChange(e, "tnttRules")}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>{t("tnttRules.nganh")}</label>
          <input
            type="text"
            name="nganh"
            value={formData.tnttRules.nganh || ""}
            onChange={(e) => handleChange(e, "tnttRules")}
          />
        </div>
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="agreed"
            name="agreed"
            checked={formData.tnttRules.agreed || false}
            onChange={(e) => handleChange(e, "tnttRules")}
          />
          <label htmlFor="agreed">{t("tnttRules.acknowledgment")}</label>
        </div>
        <div className="form-group signature-area">
          <label>{t("tnttRules.signature")}</label>
          <SignatureCanvas
            onSave={(data) => setTnttSignatureData(data)}
            onClear={() => setTnttSignatureData(null)}
            dataImage={tnttSignatureData}
          />
        </div>
      </div>

      {/* Payment Data Table */}
      <div className="form-section">
        <h2>{t("paymentPage.title")}</h2>
        <table>
          <thead>
            <tr>
              <th>{t("paymentPage.feeListTitle")}</th>
              <th>{t("paymentPage.quantityHeader")}</th>
              <th>{t("paymentPage.amountHeader")}</th>
            </tr>
          </thead>
          <tbody>
            {payment ? (
              payment.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">{t("editForm.noPaymentInfo")}</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="total-amount-display">
          <strong>
            {t("paymentPage.totalAmount")} ${total || 0}
          </strong>
        </div>
      </div>

      <div className="form-actions">
        <button
          onClick={handleUpdate}
          className="update-btn"
          disabled={loading}
        >
          {loading ? t("editForm.updatingButton") : t("editForm.updateButton")}
        </button>
      </div>
    </div>
  );
};

const InitialInput = ({ name, value, onChange }) => (
  <input
    type="text"
    className="initial-input"
    name={name}
    value={value}
    onChange={onChange}
    maxLength="3"
    required
    disabled
  />
);

export default EditFormAdult;
