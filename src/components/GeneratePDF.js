import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFromLocalStorage, removeFromLocalStorage } from '../context/storageUtils';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { getDataById } from '../context/firebaseFuncs';

const GeneratePDF = () => {
  const navigate = useNavigate();
  const hasGenerated = useRef(false); // Thêm biến ref để kiểm tra

  // Hàm render chữ ký
  const renderSignature = (signatureData) => {
    if (!signatureData) return '<span class="signature-placeholder">[Chưa ký]</span>';
    return `<img src="${signatureData}" style="width: 150px; height: auto; border-bottom: 1px solid #000;" alt="Signature" />`;
  };

  useEffect(() => {
    if (!hasGenerated.current) { // Chỉ chạy nếu chưa tạo PDF
      hasGenerated.current = true;
      generatePDF();
    }
  }, []);

  const generatePDF = async () => {
    // Lấy dữ liệu từ tất cả các form
    const data = await getDataById(getFromLocalStorage('id'));
    const registrationData = data.registration || {};
    const healthInfoData = data.healthInfo || {};
    const waiverData = data.waiverRelease || {};
    const tnttRulesData = data.tnttRules || {};
    const paymentData = data.payment || {};

    // Tạo một div ẩn để chứa nội dung PDF
    const pdfContent = document.createElement('div');
    pdfContent.style.position = 'absolute';
    pdfContent.style.left = '-9999px';
    pdfContent.style.width = '210mm';
    pdfContent.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(pdfContent);

    // Thêm nội dung vào div theo thứ tự trong PDF gốc
    const header = `
      <div class="pdf-header">
        <h1>PHONG TRÀO THIỂU NHI THÁNH THỂ VIỆT NAM TẠI HOA KỲ</h1>
        <h2>The Vietnamese Eucharistic Youth Movement in the U.S.A</h2>
        <p>Our Lady of Perpetual Help Church - Giáo Xứ Đức Mẹ Hằng Cứu Giúp</p>
        <p>Liên Đoàn Sinai | Đoàn Mẹ Thiên Chúa | Riverside, CA</p>
        <p>5250 Central Avenue, Riverside, CA 92504</p>
        <p>Cha Tuyên Úy: (chưa biết) | Đoàn Trường: Tr. Quang Nguyễn (909) 543-5559</p>
      </div>
    `;

    const page1 = `
      <div class="pdf-page">
        ${header}
        <h3 class="form-title">Đơn Ghi Danh Đoàn Thiếu Nhi Thánh Thể 2025-2026</h3>

        <!-- Thông tin cá nhân -->
        <div class="section">
          <h4>Thông tin cá nhân</h4>
          <table class="info-table">
            <tr>
              <td width="150">Em tên là:</td>
              <td><strong>${registrationData.tenThanh} ${registrationData.ho} ${registrationData.tenDem} ${registrationData.tenGoi}</strong></td>
            </tr>
            <tr>
              <td>Con của ông và bà:</td>
              <td><strong>${registrationData.tenCha} và ${registrationData.tenMe}</strong></td>
            </tr>
            <tr>
              <td>Địa chỉ nhà:</td>
              <td><strong>${registrationData.diaChi}</strong></td>
            </tr>
            <tr>
              <td>Điện thoại liên lạc:</td>
              <td>
                Nhà: <strong>${registrationData.phoneHome || 'N/A'}</strong> | 
                Di động: <strong>${registrationData.phoneCell}</strong> | 
                Cơ quan: <strong>${registrationData.phoneWork || 'N/A'}</strong>
              </td>
            </tr>
            <tr>
              <td>Số điện thoại khẩn cấp:</td>
              <td><strong>${registrationData.phoneEmergency}</strong></td>
            </tr>
            <tr>
              <td>Ngày sinh:</td>
              <td><strong>${registrationData.ngaySinh}</strong></td>
            </tr>
            <tr>
              <td>Email:</td>
              <td><strong>${registrationData.email}</strong></td>
            </tr>
          </table>
        </div>

        <!-- Lời hứa -->
        <div class="section pledge-section">
          <h4>Lời hứa</h4>
          <p class="pledge-text">
            Em xin được ghi danh gia nhập phong trào TNTT tại Đoàn TNTT Mẹ Thiên Chúa, Riverside. 
            Em hứa sẽ vâng lời và theo sự hướng dẫn của cha Tuyên Úy Đoàn, Đoàn Trưởng, các trợ tá, 
            các phụ huynh cũng như các anh chị huynh trưởng có trách nhiệm trong đoàn và trong ngành
            mà em sinh hoạt hàng tuần. Em sẽ có gắng sống 4 khẩu hiệu của Thiếu Nhi: 
            <strong>Cầu Nguyên, Rước Lễ, Hy Sinh và Làm Việc Tông Đồ</strong> cũng như thực hành các tồn chỉ của phong trào TNTT. 
            Em sẽ chu toàn bốn phân của một đoàn sinh trong đoàn TNTT và thực thi đúng các nội quy của đoàn TNTT.
          </p>
          
          <div class="signature-box">
            <p>Đoàn Sinh Ký Tên: <img src="${tnttRulesData.signature}" style="width: 150px; height: 50px;"/></p>
            <p>Ngày: ${tnttRulesData.date}</p>
          </div>
        </div>

        <!-- Xác nhận phụ huynh -->
        <div class="section parent-section">
          <h4>XÁC NHẬN CỦA PHỤ HUYNH</h4>
          <p>
            Phụ Huynh tên là: <strong>${registrationData.parentSignature.name || 'N/A'}</strong>
          </p>
          <p>
            Tôi cho phép con tôi sinh hoạt Đoàn TNTT-Mẹ Thiên Chúa, Riverside. Tôi sẽ hoàn toàn chịu trách nhiệm nếu có những trường hợp không may xảy ra với con tôi trong các giờ sinh hoạt của đoàn.
          </p>
          
          <div class="signature-box">
            <p>Phụ Huynh Ký Tên: Signature: <img src="${registrationData.parentSignature}" style="width: 150px; height: 50px;"/></p>
            <p>Ngày: ${registrationData.dateSigned}</p>
          </div>
          <p class="note">(Parent's signature needed if member is under 18 years old)</p>
        </div>
      </div>`



    const page2 = `
      <div class="pdf-page">
        ${header}
        <div class="section payment-section">
          <h4>Thanh toán</h4>
          <table class="payment-table">
            <tr>
              <td>Tiền niên liễm ($40 - student supplies/materials/fees/incentives)</td>
              <td>$${paymentData[1] ? paymentData[1] * 40 : 0}</td>
            </tr>
            <tr>
              <td>Áo đồng phục có logo ($25/each)</td>
              <td>$${paymentData[2] ? paymentData[2] * 25 : 0}</td>
            </tr>
            <tr>
              <td>Skort đồng phục ($25/each)</td>
              <td>$${paymentData[3] ? paymentData[3] * 25 : 0}</td>
            </tr>
            <tr>
              <td>TNTT scarf ($10/each)</td>
              <td>$${paymentData[4] ? paymentData[4] * 10 : 0}</td>
            </tr>
            <tr class="total-row">
              <td><strong>Tổng cộng:</strong></td>
              <td><strong>$${(paymentData[1] ? paymentData[1] * 40 : 0) +
      (paymentData[2] ? paymentData[2] * 25 : 0) +
      (paymentData[3] ? paymentData[3] * 25 : 0) +
      (paymentData[4] ? paymentData[4] * 10 : 0)
      }</strong></td>
            </tr>
          </table>
          <p class="payment-note">If pay by check, please pay to the order of: OLPH church</p>
        </div>
      </div>`


    const page3 = `
      <div class="pdf-page">
        ${header}
        <h3 class="form-title">PARTICIPANT AGREEMENT FORM</h3>
        <h4>PARTICIPANT'S INFORMATION (please print)</h4>

        <table class="info-table">
          <tr>
            <td width="150">LAST NAME:</td>
            <td><strong>${healthInfoData.lastName}</strong></td>
          </tr>
          <tr>
            <td>FIRST NAME:</td>
            <td><strong>${healthInfoData.firstName}</strong></td>
          </tr>
          <tr>
            <td>ADDRESS:</td>
            <td><strong>${healthInfoData.address}</strong></td>
          </tr>
          <tr>
            <td>CITY:</td>
            <td><strong>${healthInfoData.city}</strong></td>
          </tr>
          <tr>
            <td>STATE:</td>
            <td><strong>${healthInfoData.state}</strong></td>
          </tr>
          <tr>
            <td>ZIP CODE:</td>
            <td><strong>${healthInfoData.zipCode}</strong></td>
          </tr>
          <tr>
            <td>PHONE #:</td>
            <td><strong>${healthInfoData.phone}</strong></td>
          </tr>
          <tr>
            <td>EMAIL:</td>
            <td><strong>${healthInfoData.email}</strong></td>
          </tr>
          <tr>
            <td>BIRTH DATE:</td>
            <td><strong>${healthInfoData.birthDate}</strong> ${healthInfoData.isMinor ? '(MINOR)' : ''}</td>
          </tr>
          <tr>
            <td>GENDER:</td>
            <td><strong>${healthInfoData.gender}</strong></td>
          </tr>
          <tr>
            <td>PARISH:</td>
            <td><strong>${healthInfoData.parish}</strong></td>
          </tr>
          <tr>
            <td>DIOCESE:</td>
            <td><strong>${healthInfoData.diocese}</strong></td>
          </tr>
        </table>

        <h4>HEALTH INFORMATION</h4>
        <table class="info-table">
          <tr>
            <td width="150">DOCTOR:</td>
            <td><strong>${healthInfoData.doctor || 'N/A'}</strong></td>
          </tr>
          <tr>
            <td>DOCTOR PHONE #:</td>
            <td><strong>${healthInfoData.doctorPhone || 'N/A'}</strong></td>
          </tr>
          <tr>
            <td>INSURANCE CO.:</td>
            <td><strong>${healthInfoData.insuranceCompany || 'N/A'}</strong></td>
          </tr>
          <tr>
            <td>INSURANCE ID #:</td>
            <td><strong>${healthInfoData.insuranceId || 'N/A'}</strong></td>
          </tr>
          <tr>
            <td>INSURANCE GROUP #:</td>
            <td><strong>${healthInfoData.insuranceGroup || 'N/A'}</strong></td>
          </tr>
          <tr>
            <td>CARDHOLDER'S NAME:</td>
            <td><strong>${healthInfoData.cardholderName || 'N/A'}</strong></td>
          </tr>
          <tr>
            <td>ALLERGIES:</td>
            <td><strong>${healthInfoData.allergies || 'None'}</strong></td>
          </tr>
          <tr>
            <td>MEDICAL CONCERNS:</td>
            <td><strong>${healthInfoData.medicalConcerns || 'None'}</strong></td>
          </tr>
          <tr>
            <td>PHYSICAL RESTRICTIONS:</td>
            <td><strong>${healthInfoData.physicalRestrictions || 'None'}</strong></td>
          </tr>
        </table>

        <h4>EMERGENCY CONTACT</h4>
        <table class="info-table">
          <tr>
            <td width="150">NAME:</td>
            <td><strong>${healthInfoData.emergencyContact}</strong></td>
          </tr>
          <tr>
            <td>PHONE #:</td>
            <td><strong>${healthInfoData.emergencyPhone}</strong></td>
          </tr>
          <tr>
            <td>RELATIONSHIP:</td>
            <td><strong>${healthInfoData.emergencyRelationship}</strong></td>
          </tr>
        </table>
      </div>`



    const page4 = `
      <div class="pdf-page">
        ${header}
        <h3 class="form-title">WAIVER AND RELEASE</h3>
        
        <div class="waiver-content">
          <p>
            I, <strong>${waiverData.fullName1}</strong>, an adult [age of majority, per State (e.g., 18 years old in California)] and I
            am the named participant, or I am the parent/guardian of the minor who will be participating in the
            above-mentioned event ("The Event") organized and/or sponsored by the Vietnamese Eucharistic Youth Movement
            in the U.S.A ("VEYM"). I am fully aware that my or my child's participation in The Event is totally voluntary.
            Meanwhile, I or my child shall comply with all applicable Codes of Conduct, and generally conduct
            myself/himself/herself/themselves at all times in keeping with the highest moral and ethical standards, and abide by
            all applicable rules of law, so as to reflect positively on myself/himself/herself/themselves, the Event, and Catholic
            teachings. If I or my child violate these obligations which result in bodily injury or property damage during the
            Event, I or my child who violated these obligations will solely pay to restore or replace any property damaged as a
            result of the violation, pay any damages caused to bodily injury to an individual, and defend, protect and hold VEYM,
            its executive members, youth leaders, and volunteers, the local diocese, priests or other religious or clergy members,
            harmless, from such bodily injury or property damage claims.
          </p>

          <p>
            I am aware that The Event may involve the following activities but not limited to: running, jumping, sharing personal
            stories, singing, clapping, shouting, sitting for prolonged periods of time, early wake-up, sleeping in cabins, sleeping
            in tents, use of low-light restrooms, outdoor activities in dirt, uneven, dusty and rocky terrain, sleeping outdoors,
            activities relating to outdoor environment, aquatic activities, and supervised online group activities utilizing tools that
            include, but are not limited to Google Meets, Microsoft Teams, and Zoom, pursuant to Children's Online Privacy
            Protection Act of 1998, (15 U.S.C. 6501, et seq.,). All activities will be monitored by at least 2 adults. In
            consideration of the agreement, by the youth leaders and/or executive committee of the local chapter, to permit me
            or my child to participate in The Event, the receipt and sufficiency in which consideration is hereby acknowledged, I
            agree as follows:
          </p>

          <p>
            I, <strong>${waiverData.fullName2}</strong>, hereby:
          </p>

          <ol class="waiver-list">
            <li>
              Release, acquit and forever discharge VEYM and their employees, volunteers, agents, servants, officers, trustees,
              representatives, affiliates, and sponsors, in their official and individual capacities, as well as my Parish and my
              Diocese, their employees and agents, representatives, sponsors, chaperones, or volunteers, from any and all
              liability whatsoever for any and all damages, injuries (including death) to persons, loss to property, or both, which
              arise during, out of, or in connection with my participation in The Event, which may be sustained or suffered by me,
              my child or any person in connection with any activities of The Event, including, but not limited to, those related
              activities directly or indirectly leading up to and stemming from The Event, even those activities which arise out of
              my travel to and from The Event;
              <span class="initial-box">${waiverData.initial1 || '___'}</span> (initial)
            </li>
            <li>
              Agree to indemnify (compensate for harm or loss), defend and hold harmless VEYM and their employees,
              volunteers, agents, servants, officers, trustees, representatives, affiliates, and sponsors, in their official and
              individual capacities, as well as my Parish and my Diocese, their employees and agents, representatives,
              sponsors, chaperones, or volunteers, against all claims, including, but not limited to, claims of negligence,
              unintentional acts, and acts of omission, and from any and all liability, loss or damage they sustain as a result
              of any claims, demands, actions, causes of action, judgments, costs or expenses they incur, including
              attorney’s fees, which result from or arise out of my or my child’s participation in The Event, including but not
              limited to, my travel to and from The Event. 
              <span class="initial-box">${waiverData.initial2 || '___'}</span> (initial)
            </li>
            <li>
              There are certain inherent dangers and foreseeable and unforeseeable risks of harm to myself, my child and
              others arising from The Event’s various activities, including but not limited to, sustaining bodily or emotional
              injury, that could result from my participation in The Event. Injuries might arise from my actions or inactions,
              the actions or inactions of another participant in activities, or the actual or alleged failure by any youth
              leaders, agents or volunteers to adequately coach, train, instruct, or supervise activities. I have knowingly
              and voluntarily decided to assume the risks of these inherent dangers in consideration of the permission, by
              the youth leaders and/or executive committee of the local chapter, to allow me or my child to participate in
              The Event; 
              <span class="initial-box">${waiverData.initial3 || '___'}</span> (initial)
            </li>
            <li>
              Whether or not there is an endemic, epidemic, or pandemic, communicable diseases (such as, for examples,
              the common flu or the coronavirus) may be carried by any persons on campus. The carriers may be unknown
              or not be identified by VEYM, its directors and officers, executive committee members, youth leaders, and
              volunteers. When in-person meetings on campus are permitted by my diocese under guidelines of
              governmental and local health agencies, there is an inherent risk that my child’s or my participation may put
              me at risk of exposure, and I assume all foreseeable and unforeseeable risks of harm I or my child may be
              exposed to therefrom; 
              <span class="initial-box">${waiverData.initial4 || '___'}</span> (initial)
            </li>
            <li>
              Weather conditions, including Acts of God, or natural causes (which humans do not intervene to cause), may
              alter or affect plans, expenses, and activities relating to, and including, The Event, and I understand that
              inherent dangers and risks of harm to myself, my child and others as a result of such natural causes may
              vary, and I assume all foreseeable and unforeseeable risks of harm I or my child may be exposed to
              therefrom; 
              <span class="initial-box">${waiverData.initial5 || '___'}</span> (initial)
            </li>
            <li>
              My or my child’s personal property may be at my risk of theft, damage, or loss entirely; 
              <span class="initial-box">${waiverData.initial6 || '___'}</span> (initial)
            </li>
            <li>
              VEYM reserves the right to decline, to accept, or retain me or my child in The Event at any time should my
              actions or general behavior impede the operation of The Event or the rights or welfare of any other person. <strong><i style={{ textDecoration: 'underline' }}>I
              understand that I or my child may be required to leave The Event in the sole discretion the
              organizers, agents, and representatives.</i></strong> If I am or my child is required to leave, no refund will be given
              to me or my child for any unused portion of The Event, and the local chapter will not reimburse me for any
              alleged direct or indirect costs or expenses I or my child incurred as a result of my or my child’s participation
              in The Event. 
              <span class="initial-box">${waiverData.initial7 || '___'}</span> (initial)
            </li>
            <li>
              I understand that VEYM, in its sole discretion, reserves the right to cancel The Event or any aspect thereof
              prior to commencement. In the event of cancellation of The Event in whole or in part, I accept that I or my
              child may not be reimbursed or refunded for any unused portion of The Event. 
              <span class="initial-box">${waiverData.initial8 || '___'}</span> (initial)
            </li>
          </ol>
          <ul>
            <li>
              I represent and warrant that I am or my child is covered throughout The Event by a policy of comprehensive
              health and accident insurance which provides coverage for injuries which I or my child may sustain as part of
              my or my child’s participation in The Event. Even if I am or my child is not covered by any health insurance
              during The Event, however, I agree to complete the HEALTH INFORMATION section to the best of my ability
              and, by its completion, I hereby release and discharge VEYM of all responsibility and liability for any injuries,
              illnesses, medical bills, charges or similar expenses I may incur while participating in The Event. By
              completing the form, I hereby authorize VEYM to obtain any necessary medical treatment to myself or my
              child, consent to any necessary examination, treatment, or care under the supervision and/or advice of any
              properly licensed medical professional, and I explicitly authorize VEYM to release medical information about
              me or my child to any person or entity to whom VEYM refers me for medical treatment. 
              <span class="initial-box">${waiverData.initial9 || '___'}</span> (initial)
            </li>
            <li>
              I agree that this agreement is to be construed pursuant to the laws of the State of <strong>California</strong> and is
              intended to be as broad and inclusive as permitted by law, and if any portion hereof is held invalid, it is
              agreed that the balance hereof shall continue in full legal force and effect. In addition, I agree that any legal
              action arising out of or in relation to this agreement must be brought in <strong>Riverside County, California</strong> State
              court.
            </li>
            <li>
              To the extent that statute or case law does not prohibit releases for negligence, this release is also for
              negligence.
            </li>
            <li>
              I hereby grant VEYM my consent without reservation to use, assign, convey, reproduce, copyright, publish or
              sell my name, voice, image, and/or likeness that arise from my participation in The Event, whether still or
              motion pictures, audio or video tape, for promotional, instructional, business or any other lawful purposes, at
              VEYM’s sole discretion, should any such name, voice, image, and/or likeness be shared with VEYM by the
              local chapter.
            </li>
            
          </ul>

          <div class="signature-section">
            <p>
              IN SIGNING THIS AGREEMENT, I HEREBY ACKNOWLEDGE AND REPRESENT THAT I HAVE READ THIS ENTIRE
              DOCUMENT, THAT I UNDERSTAND ITS TERMS AND PROVISIONS, THAT I UNDERSTAND IT AFFECTS MY LEGAL
              RIGHTS, THAT IT IS A BINDING AGREEMENT, AND THAT I HAVE SIGNED IT KNOWINGLY AND VOLUNTARILY. I
              AM AWARE THAT THIS IS A RELEASE OF LIABILITY AND A CONTRACT AND I SIGN IT OF MY OWN FREE WILL.
              BY SIGNING THIS RELEASE, I ALSO ACKNOWLEDGE THAT I UNDERSTAND ITS CONTENT AND THAT THIS
              RELEASE CANNOT BE MODIFIED ORALLY.
            </p>

            <div class="signature-fields">
              <div class="signature-field">
                <p>Signature of Participant or Guardian: Signature: <img src="${waiverData.signature}" style="width: 150px; height: 50px;"/></p>
              </div>

              <div class="signature-field">
                <p>Print Name: <strong>${waiverData.printedName}</strong></p>
              </div>

              <div class="signature-field">
                <p>Dated: <strong>${waiverData.date || new Date().toLocaleDateString()}</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>`


    const page5 = `
      <div class="pdf-page">
        ${header}
        <h3 class="form-title">ĐOÀN THIẾU NHI THÁNH THỂ'S (TNTT) RULES</h3>

        <ol class="rules-list">
          <li>Obey the authority and follow the instructions of your nganh's Huynh Truongs, Doan Truong and Cha Tuyen Uy. Show respect and be polite toward all those older than you since they replace the role of your parents when you are not at home. Take care of and sacrifice for those younger than you since they are your younger brothers and sisters through Christ.</li>
          <li>Make words such as: "please", "thank you", "may I help?", "you are welcome", "yes", "no", "I don't understand" and "I'm sorry" part of your regular speech. "Thưa", "dạ", "có" and "vâng" are even better. Do not use words such as: "huh?", "yeah", "uh huh", "OK", "whatever", "sure" and "hmmmmm?" No inappropriate body sounds during any activities, especially Mass (eg, burping, yelling, yawning, flatulating, clicking tongue, humming to self).</li>
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

        <h4>CONSEQUENCES OF BREAKING 1 OF THE 8 RULES ABOVE</h4>
        <ol class="consequences-list">
          <li>The responsible Huynh Truong i.e. Doan Truong or Nganh Truong will give private warning/advice.</li>
          <li>Doan Truong and the Leadership Team will warn in Hoi Dong Huynh Truong's meeting if he/she is a huynh truong, Nganh Truong will warn in Nganh if he/she is a doan sinh.</li>
          <li>The priest will talk with the whole Doan TN about the wrongdoer and expel him/her out of Thieu Nhi. I understand and agree to follow the above rules. I will respect and love God, myself, and others.</li>
        </ol>

        <div class="agreement-section">
          <p>
            <input type="checkbox" checked> I understand and agree to follow the above rules. I will respect and love God, myself, and others.
          </p>

          <table class="signature-table">
            <tr>
              <td>Member Name: <strong>${tnttRulesData.memberName}</strong></td>
              <td>Date: <strong>${tnttRulesData.date}</strong></td>
              <td>Ngành: <strong>${tnttRulesData.nganh}</strong></td>
            </tr>
            <tr>
              <td colspan="3">
                Signature: <img src="${tnttRulesData.signature}" style="width: 150px; height: 50px;"/>
              </td>
            </tr>
          </table>

          <p class="note"><br/>*** Parent/Guardian keeps a copy of this page and goes over the rules with his/her children.</p>
        </div>
      </div>
    `;

    pdfContent.innerHTML = page1 + page2 + page3 + page4 + page5;

    // Thêm CSS cho PDF
    const style = document.createElement('style');
    style.textContent = `
      .pdf-page {
        width: 210mm;
        min-height: 297mm;
        padding: 15mm;
        margin: 0 auto;
        background: white;
        box-sizing: border-box;
        position: relative;
        page-break-after: always;
      }
      .pdf-header {
        text-align: center;
        margin-bottom: 10px;
        border-bottom: 1px solid #000;
        padding-bottom: 5px;
      }
      .pdf-header h1 {
        font-size: 12px;
        margin: 0;
      }
      .pdf-header h2 {
        font-size: 10px;
        margin: 0;
      }
      .pdf-header p {
        margin: 0;
        font-size: 8px;
      }
      .form-title {
        text-align: center;
        text-decoration: underline;
        margin: 10px 0 20px;
        font-size: 14px;
      }
      .section {
        margin-bottom: 15px;
      }
      .info-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        margin-bottom: 10px;
      }
      .info-table tr td {
        padding: 5px;
        vertical-align: top;
      }
      .pledge-text {
        font-size: 12px;
        line-height: 1.5;
        margin-bottom: 20px;
      }
      .signature-box {
        margin-top: 30px;
        width: 60%;
      }
      .signature-placeholder {
        display: inline-block;
        width: 150px;
        border-bottom: 1px solid #000;
        height: 20px;
      }
      .payment-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
      }
      .waiver-content {
        font-size: 11px;
        line-height: 1.4;
      }
      .waiver-list li, .consequences-list li {
        margin-bottom: 10px;
      }
      .initial-box {
        display: inline-block;
        width: 40px;
        border-bottom: 1px solid #000;
        text-align: center;
        margin-left: 5px;
      }
      .signature-table {
        width: 100%;
        margin-top: 30px;
        font-size: 12px;
      }
      @page {
        size: A4;
        margin: 0;
      }
    `;
    pdfContent.appendChild(style);

    // Tạo PDF
    const options = {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794, // 210mm in pixels at 96dpi
      windowHeight: 1123 // 297mm in pixels at 96dpi
    };

    // Render từng trang riêng biệt
    const pages = pdfContent.querySelectorAll('.pdf-page');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const renderPages = async (index) => {
      if (index >= pages.length) {
        if (!hasGenerated.current) return; // Thêm kiểm tra phòng trường hợp
        pdf.save(`TNTT_Registration_${registrationData.ho}_${registrationData.tenGoi}.pdf`);
        document.body.removeChild(pdfContent);
        navigate('/');
        return;
      }

      const canvas = await html2canvas(pages[index], options);
      const imgData = canvas.toDataURL('image/png');

      if (index > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

      // Render trang tiếp theo
      renderPages(index + 1);
    };

    renderPages(0);
  };

  return (
    <div className="generate-pdf-container">
      <h2>Đang tạo file PDF...</h2>
      <p>Vui lòng chờ trong giây lát</p>
    </div>
  );
};

export default GeneratePDF;