import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PDFPreview.css';

const PDFPreview = () => {
    const navigate = useNavigate();

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        navigate(-1);
    };

    const renderHeader = () => (
        <div className="pdf-header">
            <h1>PHONG TRÀO THIẾU NHI THÁNH THỂ VIỆT NAM TẠI HOA KỲ</h1>
            <h2>The Vietnamese Eucharistic Youth Movement in the U.S.A</h2>
            <div className="header-info">
                <p>Our Lady of Perpetual Help Church - Giáo Xứ Đức Mẹ Hằng Cứu Giúp</p>
                <p>Liên Đoàn Sinai | Đoàn Mẹ Thiên Chúa | Riverside, CA</p>
                <p>5250 Central Avenue Riverside, CA 92504</p>
                <p>Cha Tuyên Úy: Johnny Đặng | Đoàn Trưởng: Tr. Quang Nguyễn (909) 543-5559</p>
            </div>
        </div>
    );

    return (
        <div className="pdf-container">
            {/* Page 1: Registration Form */}
            <div className="pdf-page">
                {renderHeader()}
                <h2 className="form-title">Đơn Ghi Danh Đoàn Thiếu Nhi Thánh Thể 2024-2025</h2>

                <div className="form-section">
                    <table className="pdf-table">
                        <tbody>
                            <tr>
                                <td colSpan="4"><strong>Em tên là:</strong></td>
                            </tr>
                            <tr>
                                <td width="25%">Tên Thánh: _______________</td>
                                <td width="25%">Họ: _______________</td>
                                <td width="25%">Tên Đệm: _______________</td>
                                <td width="25%">Tên Gọi: _______________</td>
                            </tr>
                            <tr>
                                <td colSpan="4">Con của ông và bà: _______________ và _______________</td>
                            </tr>
                            <tr>
                                <td colSpan="4">Địa chỉ nhà là: _______________</td>
                            </tr>
                        </tbody>
                    </table>

                    <table className="pdf-table">
                        <tbody>
                            <tr>
                                <td colSpan="3"><strong>Điện thoại liên lạc với gia đình em là:</strong></td>
                            </tr>
                            <tr>
                                <td width="33%">Nhà: _______________</td>
                                <td width="33%">Di động: _______________</td>
                                <td width="33%">Cơ quan: _______________</td>
                            </tr>
                            <tr>
                                <td colSpan="3">Nếu trường hợp khẩn cấp, xin gọi số: _______________</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="form-row">
                        <div className="form-col">
                            <p><strong>Ngày sinh nhật của em là:</strong> __/__/____</p>
                        </div>
                        <div className="form-col">
                            <p><strong>Email:</strong> _______________</p>
                        </div>
                    </div>

                    <p><strong>Em sẽ sinh hoạt ngành:</strong></p>
                    <div className="nganh-grid">
                        <div className="nganh-col">
                            <div>[ ] Âu Dự Bị (age 6)</div>
                            <div>[ ] Âu Cấp I (age 7)</div>
                            <div>[ ] Âu Cấp II (age 8)</div>
                            <div>[ ] Âu Cấp III (age 9)</div>
                        </div>
                        <div className="nganh-col">
                            <div>[ ] Thiếu Cấp I (age 10)</div>
                            <div>[ ] Thiếu Cấp II (age 11)</div>
                            <div>[ ] Thiếu Cấp III (age 12)</div>
                        </div>
                        <div className="nganh-col">
                            <div>[ ] Nghĩa Cấp I (age 13)</div>
                            <div>[ ] Nghĩa Cấp II (age 14)</div>
                            <div>[ ] Nghĩa Cấp III (age 15)</div>
                        </div>
                        <div className="nganh-col">
                            <div>[ ] Hiệp Sĩ (age 16+)</div>
                            <div>[ ] Huynh Trưởng (age 18+)</div>
                            <div>[ ] Trợ Tá (age 35+)</div>
                        </div>
                    </div>
                </div>

                <div className="pledge-section">
                    <p>Em xin được ghi danh gia nhập phong trào TNTT tại Đoàn TNTT Mẹ Thiên Chúa, Riverside. Em hứa sẽ vâng lời và theo sự hướng dẫn của cha Tuyên Úy Đoàn, Đoàn Trưởng, các trợ tá, các phụ huynh cũng như các anh chị huynh trưởng có trách nhiệm trong đoàn và trong ngành mà em sinh hoạt hàng tuần. Em sẽ cố gắng sống 4 khẩu hiệu của Thiếu Nhi: <strong>Cầu Nguyện, Rước Lễ, Hy Sinh</strong> và <strong>Làm Việc Tông Đồ</strong> cũng như thực hành các tôn chỉ của phong trào TNTT. Em sẽ chu toàn bổn phận của một đoàn sinh trong đoàn TNTT và thực thi đúng các nội quy của đoàn TNTT.</p>

                    <div className="signature-line">
                        <div>
                            <p>Đoàn Sinh Ký Tên: _______________</p>
                        </div>
                        <div>
                            <p>Ngày: __/__/____</p>
                        </div>
                    </div>
                </div>

                <div className="parent-section">
                    <p><strong>Phụ Huynh tên là:</strong> _______________</p>
                    <p>Tôi cho phép con tôi sinh hoạt Đoàn TNTT-Mẹ Thiên Chúa, Riverside. Tôi sẽ hoàn toàn chịu trách nhiệm nếu có những trường hợp không may xảy ra với con tôi trong các giờ sinh hoạt của đoàn.</p>

                    <div className="signature-line">
                        <div>
                            <p>Phụ Huynh Ký Tên: _______________</p>
                        </div>
                        <div>
                            <p>Ngày: __/__/____</p>
                        </div>
                    </div>
                    <p className="note">(Parent's signature needed if member is under 18 years old)</p>
                </div>

                <div className="payment-section">
                    <p><strong>Tiền niên liễm ($40 - student supplies/materials/fees/incentives)</strong></p>
                    <p><strong>Áo đồng phục có logo ($25/each)</strong></p>
                    <p><strong>Skort đồng phục ($25/each)</strong></p>
                    <p><strong>TNTT scarf ($10/each)</strong></p>
                    <p>If pay by check, please pay to the order of: OLPH church</p>

                    <table className="pdf-table">
                        <tbody>
                            <tr>
                                <td>Registration Form: [ ]</td>
                                <td>Paid Fee: [ ]</td>
                                <td>Paid Uniform: [ ]</td>
                                <td>Donation: [ ]</td>
                                <td>Total Paid: ________</td>
                            </tr>
                            <tr>
                                <td colSpan="2">Registration Staff: _______________</td>
                                <td>Cash: ________</td>
                                <td colSpan="2">Check #: ________</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Page 2: Health Information */}
            <div className="pdf-page">
                {renderHeader()}
                <h2 className="section-title">PARTICIPANT AGREEMENT FORM</h2>
                <h3>PARTICIPANT'S INFORMATION (please print)</h3>

                <div className="form-section">
                    <p><strong>LAST NAME:</strong> _______________</p>
                    <p><strong>FIRST NAME:</strong> _______________</p>
                    <p><strong>ADDRESS:</strong> _______________</p>
                    <p><strong>CITY:</strong> _______________ <strong>STATE:</strong> __ <strong>ZIP CODE:</strong> _______________</p>
                    <p><strong>PHONE #:</strong> _______________ <strong>EMAIL:</strong> _______________</p>
                    <p><strong>BIRTH DATE:</strong> __/__/____</p>
                    <p><strong>MINOR:</strong> □ <strong>GENDER:</strong> □ MALE □ FEMALE</p>
                    <p><strong>PARISH:</strong> Our Lady of Perpetual Help Church, Riverside, CA</p>
                    <p><strong>DIOCESE:</strong> San Bernadino, CA</p>
                </div>

                <h3>HEALTH INFORMATION</h3>
                <div className="form-section">
                    <p><strong>DOCTOR:</strong> _______________</p>
                    <p><strong>DOCTOR PHONE #:</strong> _______________</p>
                    <p><strong>INSURANCE CO.:</strong> _______________</p>
                    <p><strong>INSURANCE ID #:</strong> _______________</p>
                    <p><strong>INSURANCE GROUP #:</strong> _______________</p>
                    <p><strong>CARDHOLDER'S NAME:</strong> _______________</p>
                    <p><strong>PARTICIPANT'S ALLERGIES:</strong> _______________</p>
                    <p><strong>CHRONIC MEDICAL CONCERNS:</strong> _______________</p>
                    <p><strong>OTHER PHYSICAL RESTRICTIONS:</strong> _______________</p>
                </div>

                <h3>EMERGENCY CONTACT</h3>
                <div className="form-section">
                    <p><strong>NAME:</strong> _______________</p>
                    <p><strong>PHONE #:</strong> _______________</p>
                    <p><strong>RELATIONSHIP TO PARTICIPANT:</strong> _______________</p>
                </div>
            </div>

            {/* Page 3: Waiver and Release */}
            <div className="pdf-page">
                {renderHeader()}
                <h2 className="section-title">WAIVER AND RELEASE</h2>

                <div className="waiver-section">
                    <p>an adult [age of majority, per State (e.g., 18 years old in California)] and I
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

                        I, ________________________, hereby:</p>

                    <div className="waiver-item">
                        <p><strong>1.</strong> Release, acquit and forever discharge VEYM and their employees, volunteers, agents, servants, officers,
                            trustees, representatives, affiliates, and sponsors, in their official and individual capacities, as well as my
                            Parish and my Diocese, their employees and agents, representatives, sponsors, chaperones, or volunteers,
                            from any and all liability whatsoever for any and all damages, injuries (including death) to persons, loss to
                            property, or both, which arise during, out of, or in connection with my participation in The Event, which may
                            be sustained or suffered by me, my child or any person in connection with any activities of The Event,
                            including, but not limited to, those related activities directly or indirectly leading up to and stemming from
                            The Event, even those activities which arise out of my travel to and from The Event;<strong>Initials:</strong> ___</p>
                    </div>

                    <div className="waiver-item">
                        <p><strong>2.</strong> Agree to indemnify (compensate for harm or loss), defend and hold harmless VEYM and their employees,
                            volunteers, agents, servants, officers, trustees, representatives, affiliates, and sponsors, in their official and
                            individual capacities, as well as my Parish and my Diocese, their employees and agents, representatives,
                            sponsors, chaperones, or volunteers, against all claims, including, but not limited to, claims of negligence,
                            unintentional acts, and acts of omission, and from any and all liability, loss or damage they sustain as a result
                            of any claims, demands, actions, causes of action, judgments, costs or expenses they incur, including
                            attorney’s fees, which result from or arise out of my or my child’s participation in The Event, including but not
                            limited to, my travel to and from The Event. <strong>Initials:</strong> ___</p>
                    </div>

                    I hereby acknowledge and accept that:

                    <div className="waiver-item">
                        <p><strong>3.</strong> There are certain inherent dangers and foreseeable and unforeseeable risks of harm to myself, my child and
                            others arising from The Event’s various activities, including but not limited to, sustaining bodily or emotional
                            injury, that could result from my participation in The Event. Injuries might arise from my actions or inactions,
                            the actions or inactions of another participant in activities, or the actual or alleged failure by any youth
                            leaders, agents or volunteers to adequately coach, train, instruct, or supervise activities. I have knowingly
                            and voluntarily decided to assume the risks of these inherent dangers in consideration of the permission, by
                            the youth leaders and/or executive committee of the local chapter, to allow me or my child to participate in
                            The Event;<strong>Initials:</strong> ___</p>
                    </div>

                    <div className="waiver-item">
                        <p><strong>4.</strong> Whether or not there is an endemic, epidemic, or pandemic, communicable diseases (such as, for examples,
                            the common flu or the coronavirus) may be carried by any persons on campus. The carriers may be unknown
                            or not be identified by VEYM, its directors and officers, executive committee members, youth leaders, and
                            volunteers. When in-person meetings on campus are permitted by my diocese under guidelines of
                            governmental and local health agencies, there is an inherent risk that my child’s or my participation may put
                            me at risk of exposure, and I assume all foreseeable and unforeseeable risks of harm I or my child may be
                            exposed to therefrom; <strong>Initials:</strong> ___</p>
                    </div>

                    <div className="waiver-item">
                        <p><strong>5.</strong> Weather conditions, including Acts of God, or natural causes (which humans do not intervene to cause), may
                            alter or affect plans, expenses, and activities relating to, and including, The Event, and I understand that
                            inherent dangers and risks of harm to myself, my child and others as a result of such natural causes may
                            vary, and I assume all foreseeable and unforeseeable risks of harm I or my child may be exposed to
                            therefrom;<strong>Initials:</strong> ___</p>
                    </div>

                    <div className="waiver-item">
                        <p><strong>6.</strong> My or my child’s personal property may be at my risk of theft, damage, or loss entirely; <strong>Initials:</strong> ___</p>
                    </div>

                    <div className="waiver-item">
                        <p><strong>7.</strong> VEYM reserves the right to decline, to accept, or retain me or my child in The Event at any time should my
                            actions or general behavior impede the operation of The Event or the rights or welfare of any other person. <strong><i style={{ textDecoration: 'underline' }}>I
                                understand that I or my child may be required to leave The Event in the sole discretion the
                                organizers, agents, and representatives.</i></strong> If I am or my child is required to leave, no refund will be given
                            to me or my child for any unused portion of The Event, and the local chapter will not reimburse me for any
                            alleged direct or indirect costs or expenses I or my child incurred as a result of my or my child’s participation
                            in The Event.<strong>Initials:</strong> ___</p>
                    </div>

                    <div className="waiver-item">
                        <p><strong>8.</strong> I understand that VEYM, in its sole discretion, reserves the right to cancel The Event or any aspect thereof
                            prior to commencement. In the event of cancellation of The Event in whole or in part, I accept that I or my
                            child may not be reimbursed or refunded for any unused portion of The Event. <strong>Initials:</strong> ___</p>
                    </div>

                    <div className="waiver-item">
                        <p>● I represent and warrant that I am or my child is covered throughout The Event by a policy of comprehensive
                            health and accident insurance which provides coverage for injuries which I or my child may sustain as part of
                            my or my child’s participation in The Event. Even if I am or my child is not covered by any health insurance
                            during The Event, however, I agree to complete the HEALTH INFORMATION section to the best of my ability
                            and, by its completion, I hereby release and discharge VEYM of all responsibility and liability for any injuries,
                            illnesses, medical bills, charges or similar expenses I may incur while participating in The Event. By
                            completing the form, I hereby authorize VEYM to obtain any necessary medical treatment to myself or my
                            child, consent to any necessary examination, treatment, or care under the supervision and/or advice of any
                            properly licensed medical professional, and I explicitly authorize VEYM to release medical information about
                            me or my child to any person or entity to whom VEYM refers me for medical treatment.<strong>Initials:</strong> ___</p>
                    </div>

                    <div className="waiver-item">
                        <p>
                            ● I agree that this agreement is to be construed pursuant to the laws of the State of <strong>California</strong> and is
                            intended to be as broad and inclusive as permitted by law, and if any portion hereof is held invalid, it is
                            agreed that the balance hereof shall continue in full legal force and effect. In addition, I agree that any legal
                            action arising out of or in relation to this agreement must be brought in <strong>Riverside County, California</strong> State
                            court.
                        </p>
                    </div>

                    <div className="waiver-item">
                        <p>
                            ● To the extent that statute or case law does not prohibit releases for negligence, this release is also for
                            negligence.
                        </p>
                    </div>

                    <div className="waiver-item">
                        <p>
                            ● I hereby grant VEYM my consent without reservation to use, assign, convey, reproduce, copyright, publish or
                            sell my name, voice, image, and/or likeness that arise from my participation in The Event, whether still or
                            motion pictures, audio or video tape, for promotional, instructional, business or any other lawful purposes, at
                            VEYM’s sole discretion, should any such name, voice, image, and/or likeness be shared with VEYM by the
                            local chapter.
                        </p>
                    </div>
                </div>

                <div className="signature-section">
                    <p>IN SIGNING THIS AGREEMENT, I HEREBY ACKNOWLEDGE AND REPRESENT THAT I HAVE READ THIS ENTIRE DOCUMENT, THAT I UNDERSTAND ITS TERMS AND PROVISIONS, THAT I UNDERSTAND IT AFFECTS MY LEGAL RIGHTS, THAT IT IS A BINDING AGREEMENT, AND THAT I HAVE SIGNED IT KNOWINGLY AND VOLUNTARILY.</p>

                    <div className="signature-line">
                        <div>
                            <p>Signature of Participant or Guardian: _______________</p>
                            <p>Print Name: _______________</p>
                            <p>Dated: __/__/____</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page 4: TNTT Rules */}
            <div className="pdf-page">
                {renderHeader()}
                <h2 className="section-title">ĐOÀN THIẾU NHI THÁNH THẾ'S (TNTT) RULES</h2>

                <div className="rules-section">
                    <ol>
                        <li>Obey the authority and follow the instructions of your ngạnh's Huynh Truongs, Doan Truong and Cha Tuyen Uy...</li>
                        <li>Make words such as: "please", "thank you", "may I help?", "you are welcome", "yes", "no", "I don't understand" and "I'm sorry" part of your regular speech...</li>
                        <li>Be on time, have good attendance, participate in all activities created by the TNTT Leadership Team...</li>
                        <li>Wear TNTT uniform approved by TNTT Leadership Team: white TNTT logo dress shirt, blue pants/shorts/skirt...</li>
                        <li>Do not bring any kind of weapon on to church property, e.g. knives, guns, lighters...</li>
                        <li>Keep your hands and feet to yourself: take care of church and TNTT property...</li>
                        <li>Avoid non-TNTT goals, e.g. storage/phillos/eros love relationships, social clichés...</li>
                        <li>No gossiping (i.e. discussing nonfactual personal information about others without them being there)...</li>
                        <li>One-on-one contact between adults (youth leader) and youth prohibited...</li>
                        <li>No hazing. Physical hazing and initiations are prohibited...</li>
                    </ol>

                    <h3>CONSEQUENCES OF BREAKING 1 OF THE 8 RULES ABOVE</h3>
                    <ol>
                        <li>The responsible Huynh Truong i.e. Doan Truong or Ngạnh Truong will give private warning/advice.</li>
                        <li>Doan Truong and the Leadership Team will warn in Hoi Dong Huynh Truong's meeting...</li>
                        <li>The priest will talk with the whole Doan TN about the wrongdoer and expel him/her out of Thieu Nhi...</li>
                    </ol>

                    <div className="signature-line">
                        <p>I understand and agree to follow the above rules. I will respect and love God, myself, and others.</p>
                        <p>Member Name: _______________</p>
                        <p>Date: __/__/____</p>
                        <p>Signature: _______________</p>
                        <p>Ngạnh: _______________</p>
                    </div>

                    <p className="note">*** Parent/Guardian keeps a copy of this page and goes over the rules with his/her children.</p>
                </div>
            </div>

            <div className="controls">
                <button onClick={handleBack} className="back-button">
                    Quay lại
                </button>
                <button onClick={handlePrint} className="print-button">
                    In Đơn Đăng Ký
                </button>
            </div>
        </div>
    );
};

export default PDFPreview;