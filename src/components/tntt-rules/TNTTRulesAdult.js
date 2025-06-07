import React, { useState, useRef, useEffect } from 'react';
import './TNTTRules.css';
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../../context/storageUtils';
import { saveTNTTRulesToFirebase } from '../../context/firebaseFuncs';

const TNTTRulesAdult = () => {
    if (!getFromLocalStorage('currentPage'))
        window.location.href = '/';
    else if (getFromLocalStorage('currentPage') !== '/tntt-rules-adult')
        window.location.href = getFromLocalStorage('currentPage');

    const [formData, setFormData] = useState(() => {
        const savedData = getFromLocalStorage('tnttRulesFormData') || {
            memberName: '',
            date: new Date().toLocaleDateString('vi-VN'),
            nganh: '',
            signature: null,
            agreed: false
        };
        return savedData;
    });

    const [errors, setErrors] = useState({});
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        saveToLocalStorage('tnttRulesFormData', formData);
        saveTNTTRulesToFirebase(getFromLocalStorage('id'), formData);
    }, [formData]);

    // Signature handling
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        ctx.beginPath();
        ctx.moveTo(
            e.clientX - rect.left,
            e.clientY - rect.top
        );
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        ctx.lineTo(
            e.clientX - rect.left,
            e.clientY - rect.top
        );
        ctx.stroke();
    };

    const stopDrawing = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.closePath();
        setIsDrawing(false);
        setFormData(prev => ({
            ...prev,
            signature: canvas.toDataURL()
        }));
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setFormData(prev => ({
            ...prev,
            signature: null
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.memberName.trim()) newErrors.memberName = 'Please enter member name';
        if (!formData.date) newErrors.date = 'Please select date';
        if (!formData.nganh) newErrors.nganh = 'Please select nganh';
        if (!formData.signature) newErrors.signature = 'Please provide signature';
        if (!formData.agreed) newErrors.agreed = 'You must agree to the rules';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            saveToLocalStorage('currentPage', '/generate-pdf');
            await saveTNTTRulesToFirebase(getFromLocalStorage('id'), formData);
            window.location.href = '/generate-pdf';
        }
    };

    return (
        <div className="tntt-rules-container">
            <h1 className="tntt-title">ĐOÀN THIẾU NHI THÁNH THỂ'S (TNTT) RULES</h1>

            <div className="rules-list">
                <ol>
                    <li>Obey the authority and follow the instructions of your nganh’s Huynh Truongs, Doan Truong and Cha Tuyen
                        Uy. Show respect and be polite toward all those older than you since they replace the role of your parents
                        when you are not at home. Take care of and sacrifice for those younger than you since they are your
                        younger brothers and sisters through Christ.</li>
                    <li>Make words such as: “please”, “thank you”, “may I help?”, “you are welcome”, “yes”, “no”, “I don’t
                        understand” and “I’m sorry” part of your regular speech. “Thưa”, “dạ”, “có” and “vâng” are even better. Do
                        not use words such as: “huh?”, “yeah”, “uh huh”, “OK”, “whatever”, “sure” and “hmmmmm?” No
                        inappropriate body sounds during any activities, especially Mass (eg, burping, yelling, yawning, flatulating,
                        clicking tongue, humming to self).</li>
                    <li>Be on time, have good attendance, participate in all activities created by the TNTT Leadership Team and all
                        church/community’s activities requested by the Community Leadership Team, and demonstrate and
                        exemplify a good model of Christian character for those younger than you by living out the Gifts of the Holy
                        Spirit and the spiritual and corporeal works of mercy.</li>
                    <li>Wear TNTT uniform approved by TNTT Leadership Team: white TNTT logo dress shirt, blue pants/ shorts/
                        skirt, scarf for your nganh, and comfortable running shoes. All parts of appropriate uniform must be clean
                        and properly on at all times during Viet Ngu, Giao Ly, TNTT and Mass times. Slovenly appearance is not
                        acceptable.</li>
                    <li>Do not bring any kind of weapon on to church property, e.g. knives, guns, lighters. Do not bring illegal items
                        on to church property either, e.g. drugs, un-Christian magazines, playing cards.</li>
                    <li>Keep your hands and feet to yourself: take care of church and TNTT property and respect the personal
                        boundaries of others.</li>
                    <li>Avoid non-TNTT goals, e.g. storage/philios/eros love relationships, social clichés, truancy to go to
                        mall/movies/shopping/ “friend’s home”.</li>
                    <li>No gossiping (i.e, discussing nonfactual personal information about others without them being there), no
                        fighting/harassing/teasing, no arguing (i.e, interrupting each other, raising voices, mocking behavior,
                        pointing), no cursing/swearing/blasphemy will be allowed during TNTT time.</li>
                    <li>One-on-one contact between adults (youth leader) and youth prohibited. One-on-one contact between
                        adults and youth members is not permitted. In situations that require personal conferences, such as a
                        leader conference, the meeting is to be conducted in view of other adults and youths.</li>
                    <li>No hazing. Physical hazing and initiations are prohibited and may not be included as part of any VEYM activity...</li>
                </ol>

                <h3>CONSEQUENCES OF BREAKING 1 OF THE 8 RULES ABOVE</h3>
                <ol>
                    <li>The responsible Huynh Truong i.e. Doan Truong or Nganh Truong will give private warning/advice.</li>
                    <li>Doan Truong and the Leadership Team will warn in Hoi Dong Huynh Truong’s meeting if he/she is a huynh
                        truong, Nganh Truong will warn in Nganh if he/she is a doan sinh.</li>
                    <li>The priest will talk with the whole Doan TN about the wrongdoer and expel him/her out of Thieu Nhi. I
                        understand and agree to follow the above rules. I will respect and love God, myself, and others.</li>
                </ol>
            </div>

            <form onSubmit={handleSubmit} className="rules-form">
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            name="agreed"
                            checked={formData.agreed}
                            onChange={handleChange}
                            required
                        />
                        {errors.agreed && <span className="error">{errors.agreed}</span>}

                        I understand and agree to follow the above rules. I will respect and love God, myself, and others.
                    </label>
                </div>

                <div className="form-row">
                    <div className={`form-group ${errors.memberName ? 'error' : ''}`}>
                        <label>Member Name:</label>
                        <input
                            type="text"
                            name="memberName"
                            value={formData.memberName}
                            onChange={handleChange}
                            required
                        />
                        {errors.memberName && <span className="error">{errors.memberName}</span>}
                    </div>

                    <div className={`form-group ${errors.date ? 'error' : ''}`}>
                        <label>Date: {new Date().toLocaleDateString('vi-VN')}</label>
                    </div>

                    <div className={`form-group ${errors.nganh ? 'error' : ''}`}>
                        <label>Ngành:</label>
                        <select
                            name="nganh"
                            value={formData.nganh}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Nganh</option>
                            <option value="Hiệp Sĩ Trưởng Thành">Hiệp Sĩ Trưởng Thành</option>
                            <option value="Huynh Trưởng">Huynh Trưởng</option>
                            <option value="Trợ Tá">Trợ Tá</option>
                            <option value="Huấn Luyện Viên">Huấn Luyện Viên</option>
                        </select>
                        {errors.nganh && <span className="error">{errors.nganh}</span>}
                    </div>
                </div>

                <div className={`form-group signature-group ${errors.signature ? 'error' : ''}`}>
                    <label>Signature:</label>
                    <div className="signature-container">
                        <canvas
                            ref={canvasRef}
                            width={400}
                            height={150}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                        <button type="button" onClick={clearSignature} className="clear-btn">
                            Clear Signature
                        </button>
                    </div>
                    {errors.signature && <span className="error">{errors.signature}</span>}
                </div>

                <div className="form-note">
                    <p>*** Parent/Guardian keeps a copy of this page and goes over the rules with his/her children.</p>
                </div>

                <button type="submit" className="submit-btn">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default TNTTRulesAdult;