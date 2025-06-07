import React, { useState, useRef, useEffect } from "react";
import "./WaiverRelease.css";
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../../context/storageUtils';
import { saveWaiverReleaseToFirebase } from "../../context/firebaseFuncs";

const WaiverRelease = () => {
    removeFromLocalStorage('tnttRulesFormData');

    if (!getFromLocalStorage('currentPage'))
        window.location.href = '/';
    else if (getFromLocalStorage('currentPage') !== '/waiver-release')
        window.location.href = getFromLocalStorage('currentPage');

    const [formData, setFormData] = useState(() => {
        const savedData = getFromLocalStorage('waiverFormData') || {
            fullName1: "",
            fullName2: "",
            initial1: "",
            initial2: "",
            initial3: "",
            initial4: "",
            initial5: "",
            initial6: "",
            initial7: "",
            initial8: "",
            initial9: "",
            signature: null,
            printedName: "",
            date: new Date().toLocaleDateString('vi-VN')
        };
        return savedData;
    });

    // State cho validation errors
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        saveToLocalStorage('waiverFormData', formData);
        saveWaiverReleaseToFirebase(getFromLocalStorage('id'), formData);
    }, [formData]);

    // Hàm xử lý submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const currentId = getFromLocalStorage('id'); // Lấy ID ra một biến
        console.log('ID from Local Storage:', currentId); // LOG ID

        if (!currentId) {
            alert('Không tìm thấy ID đăng ký. Vui lòng quay lại trang đăng ký ban đầu.');
            setIsSubmitting(false);
            return;
        }

        if (!formData.signature) {
            alert('Vui lòng ký tên xác nhận');
            setIsSubmitting(false);
            return;
        }

        saveToLocalStorage('currentPage', '/tntt-rules');
        console.log('Attempting to save waiver data:', formData); // LOG dữ liệu bạn đang cố gắng lưu
        try {
            await saveWaiverReleaseToFirebase(currentId, formData); // Truyền currentId vào đây
            console.log("Waiver data saved successfully to Firebase!"); // LOG thành công
            window.location.href = '/tntt-rules';
        } catch (error) {
            console.error("Error saving waiver data to Firebase:", error); // LOG lỗi chi tiết
            alert('Đã xảy ra lỗi khi lưu dữ liệu. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hàm xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes("initial") ? value.toUpperCase() : value
        }));

        // Clear error khi người dùng bắt đầu nhập
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    // Hàm nhận chữ ký từ component con
    const handleSignatureSave = (signatureData) => {
        setFormData(prev => ({
            ...prev,
            signature: signatureData,
            date: new Date().toLocaleDateString('vi-VN')
        }));

        if (errors.signature) {
            setErrors(prev => ({ ...prev, signature: false }));
        }
    };

    return (
        <form className="waiver-container" onSubmit={handleSubmit}>
            <h2 className="waiver-title">WAIVER AND RELEASE</h2>

            <div className="waiver-content">
                <p>
                    I, <InlineInput
                        name="fullName1"
                        value={formData.fullName1}
                        onChange={handleChange}
                        width="300px"
                    />, an adult [age of majority, per State (e.g., 18 years old in California)] and I
                    am the named participant, or I am the parent/guardian of the minor who will be participating in the
                    above-mentioned event (“The Event”) organized and/or sponsored by the Vietnamese Eucharistic Youth Movement
                    in the U.S.A. (“VEYM”). I am fully aware that my or my child’s participation in The Event is totally voluntary.
                    Meanwhile, I or my child shall comply with all applicable Codes of Conduct, and generally conduct
                    myself/himself/herself/themselves at all times in keeping with the highest moral and ethical standards, and abide by
                    all applicable rules of law, so as to reflect positively on myself/himself/herself/themselves, the Event, and Catholic
                    teachings. If I or my child violate these obligations which result in bodily injury or property damage during the
                    Event, I or my child who violated these obligations will solely pay to restore or replace any property damaged as a
                    result of the violation, pay any damages caused to bodily injury to an individual, and defend, protect and hold VEYM,
                    its executive members, youth leaders, and volunteers, the local diocese, priests or other religious or clergy members,
                    harmless, from such bodily injury or property damage claims. <br /><br />

                    I am aware that The Event may involve the following activities but not limited to: running, jumping, sharing personal
                    stories, singing, clapping, shouting, sitting for prolonged periods of time, early wake-up, sleeping in cabins, sleeping
                    in tents, use of low-light restrooms, outdoor activities in dirt, uneven, dusty and rocky terrain, sleeping outdoors,
                    activities relating to outdoor environment, aquatic activities, and supervised online group activities utilizing tools that
                    include, but are not limited to Google Meets, Microsoft Teams, and Zoom, pursuant to Children's Online Privacy
                    Protection Act of 1998, (15 U.S.C. 6501, et seq.,). All activities will be monitored by at least 2 adults. In
                    consideration of the agreement, by the youth leaders and/or executive committee of the local chapter, to permit me
                    or my child to participate in The Event, the receipt and sufficiency in which consideration is hereby acknowledged, I
                    agree as follows:<br /><br />

                    I, <InlineInput
                        name="fullName2"
                        value={formData.fullName2}
                        onChange={handleChange}
                        width="300px"
                    />, hereby:
                </p>

                {/* All numbered points with inputs */}

                <div className="waiver-section">
                    <p>
                        <strong>1.</strong> Release, acquit and forever discharge VEYM and their employees, volunteers, agents, servants, officers,
                        trustees, representatives, affiliates, and sponsors, in their official and individual capacities, as well as my
                        Parish and my Diocese, their employees and agents, representatives, sponsors, chaperones, or volunteers,
                        from any and all liability whatsoever for any and all damages, injuries (including death) to persons, loss to
                        property, or both, which arise during, out of, or in connection with my participation in The Event, which may
                        be sustained or suffered by me, my child or any person in connection with any activities of The Event,
                        including, but not limited to, those related activities directly or indirectly leading up to and stemming from
                        The Event, even those activities which arise out of my travel to and from The Event;<br />
                        <InitialInput
                            name="initial1"
                            value={formData.initial1}
                            onChange={handleChange}
                        /> (please initial for concurrence)
                    </p>
                </div>

                <div className="waiver-section">
                    <p>
                        <strong>2.</strong> Agree to indemnify (compensate for harm or loss), defend and hold harmless VEYM and their employees,
                        volunteers, agents, servants, officers, trustees, representatives, affiliates, and sponsors, in their official and
                        individual capacities, as well as my Parish and my Diocese, their employees and agents, representatives,
                        sponsors, chaperones, or volunteers, against all claims, including, but not limited to, claims of negligence,
                        unintentional acts, and acts of omission, and from any and all liability, loss or damage they sustain as a result
                        of any claims, demands, actions, causes of action, judgments, costs or expenses they incur, including
                        attorney’s fees, which result from or arise out of my or my child’s participation in The Event, including but not
                        limited to, my travel to and from The Event. <br />
                        <InitialInput
                            name="initial2"
                            value={formData.initial2}
                            onChange={handleChange}
                        /> (please initial for concurrence)
                    </p>
                </div>

                I hereby acknowledge and accept that:

                <div className="waiver-section">
                    <p>
                        <strong>3.</strong> There are certain inherent dangers and foreseeable and unforeseeable risks of harm to myself, my child and
                        others arising from The Event’s various activities, including but not limited to, sustaining bodily or emotional
                        injury, that could result from my participation in The Event. Injuries might arise from my actions or inactions,
                        the actions or inactions of another participant in activities, or the actual or alleged failure by any youth
                        leaders, agents or volunteers to adequately coach, train, instruct, or supervise activities. I have knowingly
                        and voluntarily decided to assume the risks of these inherent dangers in consideration of the permission, by
                        the youth leaders and/or executive committee of the local chapter, to allow me or my child to participate in
                        The Event;<br />
                        <InitialInput
                            name="initial3"
                            value={formData.initial3}
                            onChange={handleChange}
                        /> (please initial for concurrence)
                    </p>
                </div>

                <div className="waiver-section">
                    <p>
                        <strong>4.</strong> Whether or not there is an endemic, epidemic, or pandemic, communicable diseases (such as, for examples,
                        the common flu or the coronavirus) may be carried by any persons on campus. The carriers may be unknown
                        or not be identified by VEYM, its directors and officers, executive committee members, youth leaders, and
                        volunteers. When in-person meetings on campus are permitted by my diocese under guidelines of
                        governmental and local health agencies, there is an inherent risk that my child’s or my participation may put
                        me at risk of exposure, and I assume all foreseeable and unforeseeable risks of harm I or my child may be
                        exposed to therefrom; <br />
                        <InitialInput
                            name="initial4"
                            value={formData.initial4}
                            onChange={handleChange}
                        /> (please initial for concurrence)
                    </p>
                </div>

                <div className="waiver-section">
                    <p>
                        <strong>5.</strong> Weather conditions, including Acts of God, or natural causes (which humans do not intervene to cause), may
                        alter or affect plans, expenses, and activities relating to, and including, The Event, and I understand that
                        inherent dangers and risks of harm to myself, my child and others as a result of such natural causes may
                        vary, and I assume all foreseeable and unforeseeable risks of harm I or my child may be exposed to
                        therefrom;<br />
                        <InitialInput
                            name="initial5"
                            value={formData.initial5}
                            onChange={handleChange}
                        /> (please initial for concurrence)
                    </p>
                </div>

                <div className="waiver-section">
                    <p>
                        <strong>6.</strong> My or my child’s personal property may be at my risk of theft, damage, or loss entirely; <br />
                        <InitialInput
                            name="initial6"
                            value={formData.initial6}
                            onChange={handleChange}
                        /> (please initial for concurrence)
                    </p>
                </div>

                <div className="waiver-section">
                    <p>
                        <strong>7.</strong> VEYM reserves the right to decline, to accept, or retain me or my child in The Event at any time should my
                        actions or general behavior impede the operation of The Event or the rights or welfare of any other person. <strong><i style={{ textDecoration: 'underline' }}>I
                            understand that I or my child may be required to leave The Event in the sole discretion the
                            organizers, agents, and representatives.</i></strong> If I am or my child is required to leave, no refund will be given
                        to me or my child for any unused portion of The Event, and the local chapter will not reimburse me for any
                        alleged direct or indirect costs or expenses I or my child incurred as a result of my or my child’s participation
                        in The Event.<br />
                        <InitialInput
                            name="initial7"
                            value={formData.initial7}
                            onChange={handleChange}
                        /> (please initial for concurrence)
                    </p>
                </div>

                <div className="waiver-section">
                    <p>
                        <strong>8.</strong> I understand that VEYM, in its sole discretion, reserves the right to cancel The Event or any aspect thereof
                        prior to commencement. In the event of cancellation of The Event in whole or in part, I accept that I or my
                        child may not be reimbursed or refunded for any unused portion of The Event. <br />
                        <InitialInput
                            name="initial8"
                            value={formData.initial8}
                            onChange={handleChange}
                        /> (please initial for concurrence)
                    </p>
                </div>

                {/* Points 3-8 follow same pattern */}
                {/* ... */}

                <div className="waiver-section">
                    <p>
                        ● I represent and warrant that I am or my child is covered throughout The Event by a policy of comprehensive
                        health and accident insurance which provides coverage for injuries which I or my child may sustain as part of
                        my or my child’s participation in The Event. Even if I am or my child is not covered by any health insurance
                        during The Event, however, I agree to complete the HEALTH INFORMATION section to the best of my ability
                        and, by its completion, I hereby release and discharge VEYM of all responsibility and liability for any injuries,
                        illnesses, medical bills, charges or similar expenses I may incur while participating in The Event. By
                        completing the form, I hereby authorize VEYM to obtain any necessary medical treatment to myself or my
                        child, consent to any necessary examination, treatment, or care under the supervision and/or advice of any
                        properly licensed medical professional, and I explicitly authorize VEYM to release medical information about
                        me or my child to any person or entity to whom VEYM refers me for medical treatment.
                        <InitialInput
                            name="initial9"
                            value={formData.initial9}
                            onChange={handleChange}
                        /> (please initial for concurrence)
                    </p>
                </div>

                <div className="waiver-section">
                    <p>
                        ● I agree that this agreement is to be construed pursuant to the laws of the State of <strong>California</strong> and is
                        intended to be as broad and inclusive as permitted by law, and if any portion hereof is held invalid, it is
                        agreed that the balance hereof shall continue in full legal force and effect. In addition, I agree that any legal
                        action arising out of or in relation to this agreement must be brought in <strong>Riverside County, California</strong> State
                        court.
                    </p>
                </div>

                <div className="waiver-section">
                    <p>
                        ● To the extent that statute or case law does not prohibit releases for negligence, this release is also for
                        negligence.
                    </p>
                </div>

                <div className="waiver-section">
                    <p>
                        ● I hereby grant VEYM my consent without reservation to use, assign, convey, reproduce, copyright, publish or
                        sell my name, voice, image, and/or likeness that arise from my participation in The Event, whether still or
                        motion pictures, audio or video tape, for promotional, instructional, business or any other lawful purposes, at
                        VEYM’s sole discretion, should any such name, voice, image, and/or likeness be shared with VEYM by the
                        local chapter.
                    </p>
                </div>

                <div className="signature-section">
                    <p>
                        IN SIGNING THIS AGREEMENT, I HEREBY ACKNOWLEDGE AND REPRESENT THAT I HAVE READ THIS ENTIRE
                        DOCUMENT, THAT I UNDERSTAND ITS TERMS AND PROVISIONS, THAT I UNDERSTAND IT AFFECTS MY LEGAL
                        RIGHTS, THAT IT IS A BINDING AGREEMENT, AND THAT I HAVE SIGNED IT KNOWINGLY AND VOLUNTARILY. I
                        AM AWARE THAT THIS IS A RELEASE OF LIABILITY AND A
                        CONTRACT AND I SIGN IT OF MY OWN FREE WILL. BY SIGNING THIS RELEASE, I ALSO ACKNOWLEDGE THAT I
                        UNDERSTAND ITS CONTENT AND THAT THIS RELEASE CANNOT BE MODIFIED ORALLY.
                    </p>

                    <div className="signature-fields">
                        <div className="signature-field">
                            <label>Signature of Participant or Guardian:</label>
                            <SignaturePad onSaveSignature={handleSignatureSave} />
                        </div>

                        <SignatureField
                            label="Print Name:"
                            name="printedName"
                            value={formData.printedName}
                            onChange={handleChange}
                        />

                        <div className="signature-field">
                            <label>Dated: {new Date().toLocaleDateString('vi-VN')}</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="submit-btn">Chuyển tiếp</button>
            </div>
        </form>
    );
};

// Custom Components for consistent styling
const InlineInput = ({ name, value, onChange, width }) => (
    <input
        type="text"
        className="inline-input"
        name={name}
        value={value}
        onChange={onChange}
        style={{ width }}
        required
    />
);

const InitialInput = ({ name, value, onChange }) => (
    <input
        type="text"
        className="initial-input"
        name={name}
        value={value}
        onChange={onChange}
        maxLength="3"
        required
    />
);

const SignatureField = ({ label, name, value, onChange, type = "text" }) => (
    <div className="signature-field">
        <label>{label}</label>
        <input
            type={type}
            className="signature-input"
            name={name}
            value={value}
            onChange={onChange}
            required
        />
    </div>
);

const SignaturePad = ({ onSaveSignature }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // Khởi tạo canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const updateCanvasSize = () => {
            const displayWidth = Math.min(500, window.innerWidth - 40);
            const displayHeight = 150;

            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
            canvas.width = displayWidth;
            canvas.height = displayHeight;

            setCanvasSize({ width: displayWidth, height: displayHeight });
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    // Bắt đầu vẽ
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
        setIsDrawing(true);
    };

    // Vẽ nét
    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    // Dừng vẽ và lưu chữ ký
    const stopDrawing = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.closePath();
        setIsDrawing(false);

        // Gửi chữ ký về component cha
        if (onSaveSignature) {
            onSaveSignature(canvas.toDataURL());
        }
    };

    // Xóa chữ ký
    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (onSaveSignature) {
            onSaveSignature(null);
        }
    };

    return (
        <div className="signature-pad-container">
            <canvas
                ref={canvasRef}
                className="signature-canvas"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
            <button
                type="button"
                className="clear-signature-btn"
                onClick={clearSignature}
            >
                Clear Signature
            </button>
        </div>
    );
};

export default WaiverRelease;