
/**
 * نظام إدارة الإجازات - شركة الدقهلية للدواجن
 * ISO Form: F-HR-601
 * قطاع المخازن - نظام التوجيه الديناميكي للأقسام
 */

const CONFIG = {
  SHEET_NAME: 'Requests_Warehouses_ISO',
  LOGO_BASE64: 'data:image/jpeg;base64,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',
  
  // تعريف الأقسام ومديريها المباشرين
  DEPARTMENTS: {
    "التخطيط و المتابعة": {
      managerEmail: "ahmed.hamdan@dakahlia.net",
      managerName: "أ/ رئيس قسم التخطيط و المتابعة"
    },
    "إدارة المخازن": {
      managerEmail: "ahmed.hamdan@dakahlia.net",
      managerName: "أ/ مدير إدارة المخازن"
    },
    "الخامات": {
      managerEmail: "raw.store.mgr@dakahlia.net",
      managerName: "أ/ رئيس قسم مخزن الخامات"
    },
    "المنتج التام": {
      managerEmail: "finished.store@dakahlia.net",
      managerName: "أ/ رئيس قسم المنتج التام"
    },
    "قطع الغيار": {
      managerEmail: "spareparts.store@dakahlia.net",
      managerName: "أ/ رئيس قسم قطع الغيار"
    },
    "المخازن العامة": {
      managerEmail: "general.store@dakahlia.net",
      managerName: "أ/ رئيس قسم المخازن العامة"
    },
    "حركة المعدات": {
      managerEmail: "equipment.mgr@dakahlia.net",
      managerName: "أ/ مدير حركة المعدات"
    }
  },

  // استثناء إداري خاص بمدير المخازن (المدير الأعلى المعتمد عليه)
  WAREHOUSE_DIRECTOR_EXCEPTION: {
    directorEmail: "ahmed.hamdan@dakahlia.net",
    directorName: "أ/ أحمد حمدان",
    directorCode: "70335",
    managerEmail: "abdelhady.saleh@dakahlia.net",
    managerName: "أ/ عبد الهادي صالح"
  },

  // الجهات الموحدة
  FINAL_APPROVERS: {
    DEPT_HEAD: {
      email: "ahmed.hamdan@dakahlia.net",
      name: "أ/ مدير الاداره"
    },
    HR: {
      email: "sadat.planning.officer@dakahlia.net",
      name: "إدارة الموارد البشرية"
    }
  }
};

/**
 * التحقق مما إذا كان الطلب يخص مدير المخازن (أ/ أحمد حمدان)
 */
function isWarehouseDirectorRequest(data) {
  if (!data) return false;
  const email = String(data.employeeEmail || data.submitterEmail || '').trim().toLowerCase();
  const name = String(data.employeeName || '').trim();
  const code = String(data.employeeCode || '').trim();
  const title = String(data.jobTitle || '').trim();

  return (
    email === 'ahmed.hamdan@dakahlia.net' ||
    code === '70335' ||
    name.indexOf('حمدان') > -1 ||
    name.indexOf('احمد حمدان') > -1 ||
    name.indexOf('أحمد حمدان') > -1 ||
    (data.department === 'إدارة المخازن' && title.indexOf('مدير') > -1)
  );
}

/**
 * دالة مساعدة لتنسيق التاريخ ليظهر dd/mm/yyyy فقط
 */
function formatSimpleDate(val) {
  if (!val) return "";
  try {
    // إذا كانت القيمة كائن تاريخ
    if (val instanceof Date) {
      return Utilities.formatDate(val, "GMT+2", "dd/MM/yyyy");
    }
    // إذا كانت نصاً طويلاً ناتجاً عن تحويل تاريخ
    if (typeof val === 'string' && val.includes('GMT')) {
      return Utilities.formatDate(new Date(val), "GMT+2", "dd/MM/yyyy");
    }
    // إذا كانت نصاً بتنسيق yyyy-mm-dd (من Frontend)
    if (typeof val === 'string' && val.includes('-') && val.split('-')[0].length === 4) {
      const parts = val.split('-');
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return String(val);
  } catch (e) {
    return String(val);
  }
}

/**
 * معالجة طلبات POST
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const requestId = data.requestId || 'REQ' + new Date().getTime();
    
    const deptInfo = CONFIG.DEPARTMENTS[data.department] || CONFIG.DEPARTMENTS["إدارة المخازن"];
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.insertSheet(CONFIG.SHEET_NAME);
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['ID', 'Date Created', 'Emp Code', 'Emp Name', 'Title', 'Dept', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Reason', 'Email', 'Signatures']);
    }

    const today = formatSimpleDate(data.issueDate || new Date());
    const startDate = formatSimpleDate(data.startDate);
    const endDate = formatSimpleDate(data.endDate);

    // استخراج بريد حساب Google النشط من المتصفح تلقائياً (مثل Google Forms)
    var browserEmail = '';
    try {
      browserEmail = Session.getActiveUser().getEmail();
    } catch (e) {}
    // تنبيه حاسم: لا نستخدم مطلقاً Session.getEffectiveUser() لأنها ترجع إيميل المطور/المشرف لكل الزائرين
    const submitterEmail = browserEmail || data.submitterEmail || '';

    sheet.appendRow([
      requestId, 
      today, 
      data.employeeCode, 
      data.employeeName, 
      data.jobTitle, 
      data.department, 
      data.leaveType, 
      startDate, 
      endDate, 
      data.daysCount, 
      'PENDING_MANAGER', 
      data.reason || '', 
      data.employeeEmail || '', 
      JSON.stringify([]),
      submitterEmail
    ]);
    
    const empDataForPdf = {
      employeeName: String(data.employeeName),
      employeeCode: String(data.employeeCode),
      jobTitle: String(data.jobTitle),
      department: String(data.department),
      leaveType: String(data.leaveType),
      daysCount: String(data.daysCount),
      startDate: startDate,
      endDate: endDate,
      reason: String(data.reason || 'لا يوجد'),
      today: today,
      submitterEmail: submitterEmail
    };

    const isDirector = isWarehouseDirectorRequest(data);
    let targetManagerEmail = deptInfo.managerEmail;
    let targetRole = 'المدير المباشر';

    // تطبيق استثناء مدير المخازن (أ/ أحمد حمدان يتبع أ/ عبد الهادي صالح)
    if (isDirector) {
      targetManagerEmail = CONFIG.WAREHOUSE_DIRECTOR_EXCEPTION.managerEmail;
      targetRole = 'المدير العام (المشرف على مدير المخازن)';
    }

    let pdf = generateFinalPDF(requestId, empDataForPdf, []);
    sendApprovalMail(targetManagerEmail, targetRole, requestId, empDataForPdf, pdf);
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, requestId: requestId }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    console.error("Critical Error: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // فحص استعلام المستخدم النشط أو مزامنة الموظفين
  if (e && e.parameter && e.parameter.action === 'getActiveUser') {
    var activeEmail = '';
    try {
      activeEmail = Session.getActiveUser().getEmail();
    } catch (e) {}
    // لا نضع إيميل المشرف/الناشر مطلقاً كبديل
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      email: activeEmail || ''
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const id = e && e.parameter ? e.parameter.id : null;
  const action = e && e.parameter ? e.parameter.action : null;
  const role = e && e.parameter ? e.parameter.role : null;
  try {
    const result = handleWorkflowStep(id, action, role);
    const color = action === 'approve' ? '#166534' : '#991b1b';
    return HtmlService.createHtmlOutput(`
      <div dir="rtl" style="font-family: Arial; text-align: center; padding: 50px;">
        <h1 style="color: ${color};">${result.message}</h1>
        <p style="color: #666;">تم تحديث سجلات النظام بنجاح.</p>
      </div>
    `);
  } catch (err) {
    return HtmlService.createHtmlOutput(`<div dir="rtl"><h1>خطأ: ${err.toString()}</h1></div>`);
  }
}

function handleWorkflowStep(id, action, role) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  let rowIndex = -1;
  let rowData = null;

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      rowIndex = i + 1;
      rowData = values[i];
      break;
    }
  }
  
  if (!rowData) throw "الطلب غير موجود.";
  
  const empData = {
    today: formatSimpleDate(rowData[1]),
    employeeCode: String(rowData[2]),
    employeeName: String(rowData[3]),
    jobTitle: String(rowData[4]),
    department: String(rowData[5]),
    leaveType: String(rowData[6]),
    startDate: formatSimpleDate(rowData[7]),
    endDate: formatSimpleDate(rowData[8]),
    daysCount: String(rowData[9]),
    reason: String(rowData[11]),
    employeeEmail: String(rowData[12]),
    submitterEmail: String(rowData[14] || '')
  };
  
  let signatures = JSON.parse(rowData[13] || '[]');
  const isDirector = isWarehouseDirectorRequest(empData);

  if (action === 'reject') {
    sheet.getRange(rowIndex, 11).setValue('REJECTED');
    return { message: "تم رفض الطلب بنجاح." };
  }

  // معالجة استثناء طلب مدير المخازن (أ/ أحمد حمدان)
  if (isDirector) {
    if (signatures.indexOf('MANAGER') === -1) {
      signatures.push('MANAGER');
      signatures.push('DEPT_HEAD'); // اعتماد أ/ عبد الهادي صالح يمثل اعتماد المدير المباشر والإدارة لمدير المخازن
      sheet.getRange(rowIndex, 11).setValue('PENDING_HR');
      sheet.getRange(rowIndex, 14).setValue(JSON.stringify(signatures));
      let pdf = generateFinalPDF(id, empData, signatures);
      sendApprovalMail(CONFIG.FINAL_APPROVERS.HR.email, 'الموارد البشرية', id, empData, pdf);
      return { message: "تم اعتماد إجازة مدير المخازن بنجاح من أ/ عبد الهادي صالح وإحالتها للموارد البشرية." };
    }
  } else {
    // التدفق العادي للأقسام
    if (role === 'المدير المباشر' && signatures.indexOf('MANAGER') === -1) {
      signatures.push('MANAGER');
      signatures.push('MANAGER_APPROVED');
      sheet.getRange(rowIndex, 11).setValue('PENDING_DEPT_HEAD');
      sheet.getRange(rowIndex, 14).setValue(JSON.stringify(signatures));
      let pdf = generateFinalPDF(id, empData, signatures);
      
      const directMgr = CONFIG.DEPARTMENTS[empData.department]?.managerEmail;
      // إذا كان المدير المباشر هو نفسه مدير المخازن (أحمد حمدان)، يوجه للمدير الأعلى عليه (أ/ عبد الهادي صالح)
      if (directMgr === CONFIG.FINAL_APPROVERS.DEPT_HEAD.email) {
        sendApprovalMail(CONFIG.WAREHOUSE_DIRECTOR_EXCEPTION.managerEmail, 'مدير الإدارة (المشرف العام)', id, empData, pdf);
      } else {
        sendApprovalMail(CONFIG.FINAL_APPROVERS.DEPT_HEAD.email, 'مدير الإدارة', id, empData, pdf);
      }
      return { message: "تم اعتماد المدير المباشر بنجاح." };
    } 
    else if ((role === 'مدير الإدارة' || role === 'مدير الإدارة (المشرف العام)') && signatures.indexOf('DEPT_HEAD') === -1) {
      signatures.push('DEPT_HEAD');
      sheet.getRange(rowIndex, 11).setValue('PENDING_HR');
      sheet.getRange(rowIndex, 14).setValue(JSON.stringify(signatures));
      let pdf = generateFinalPDF(id, empData, signatures);
      sendApprovalMail(CONFIG.FINAL_APPROVERS.HR.email, 'الموارد البشرية', id, empData, pdf);
      return { message: "تم اعتماد مدير الإدارة بنجاح." };
    }
  }

  // مرحلة اعتماد الموارد البشرية النهائية
  if (role === 'الموارد البشرية' && signatures.indexOf('HR') === -1) {
    signatures.push('HR');
    signatures.push('APPROVED');
    sheet.getRange(rowIndex, 11).setValue('APPROVED');
    sheet.getRange(rowIndex, 14).setValue(JSON.stringify(signatures));
    let pdf = generateFinalPDF(id, empData, signatures);
    if (empData.employeeEmail) {
      GmailApp.sendEmail(empData.employeeEmail, `✅ تم اعتماد إجازتك - رقم ${id}`, `تم اعتماد وتوثيق طلبك بالكامل (APPROVED).`, {
        attachments: [pdf]
      });
    }
    return { message: "تم الاعتماد النهائي للإجازة وتوثيقها (APPROVED)." };
  }
  return { message: "الإجراء تم مسبقاً." };
}

function generateFinalPDF(id, data, signatures) {
  const template = HtmlService.createTemplateFromFile('EmailTemplates');
  template.data = data;
  template.signatures = signatures;
  template.config = CONFIG;
  const htmlContent = template.evaluate().getContent();
  const blob = Utilities.newBlob(htmlContent, 'text/html', `Request_${id}.html`);
  return blob.getAs('application/pdf').setName(`Leave_Request_${id}.pdf`);
}

function sendApprovalMail(targetEmail, role, id, data, pdfBlob) {
  const baseUrl = ScriptApp.getService().getUrl();
  const approveUrl = `${baseUrl}?id=${id}&action=approve&role=${encodeURIComponent(role)}`;
  const rejectUrl = `${baseUrl}?id=${id}&action=reject&role=${encodeURIComponent(role)}`;
  
  const isDirector = isWarehouseDirectorRequest(data);
  const exceptionNotice = isDirector ? `
    <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 10px 15px; border-radius: 8px; margin-bottom: 15px; font-weight: bold; color: #92400e;">
      ⭐ استثناء إداري: هذا الطلب يخص أ/ أحمد حمدان (مدير المخازن) وموجه لسيادتكم للاعتماد بصفتكم المدير المباشر عليه.
    </div>
  ` : '';

  const htmlBody = `
    <div dir="rtl" style="font-family: Arial, sans-serif; border: 1px solid #e5e7eb; padding: 25px; border-radius: 15px; max-width: 600px; margin: auto;">
      <h2 style="color: #1e3a8a; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">طلب إجازة للمراجعة - ${role}</h2>
      ${exceptionNotice}
      <p>عزيزي <b>المسؤول</b>،</p>
      <p>يرجى مراجعة طلب الإجازة المقدم من الموظف التالي:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <tr><td style="padding: 5px; color: #666;">اسم الموظف:</td><td style="font-weight: bold;">${data.employeeName}</td></tr>
        <tr><td style="padding: 5px; color: #666;">الوظيفة والقسم:</td><td style="font-weight: bold;">${data.jobTitle} - ${data.department}</td></tr>
        <tr><td style="padding: 5px; color: #666;">نوع الإجازة:</td><td style="color: #f59e0b; font-weight: bold;">${data.leaveType}</td></tr>
        <tr><td style="padding: 5px; color: #666;">التاريخ:</td><td style="font-weight: bold;">من ${data.startDate} إلى ${data.endDate} (${data.daysCount} أيام)</td></tr>
        <tr><td style="padding: 5px; color: #666;">حساب منشئ الطلب:</td><td style="font-family: monospace; font-weight: bold; color: #1e3a8a;" dir="ltr">${data.submitterEmail || 'غير محدد'}</td></tr>
      </table>
      <div style="margin-top: 30px; display: flex; gap: 10px; justify-content: center;">
        <a href="${approveUrl}" style="background: #166534; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-left: 10px;">اعتماد الطلب</a>
        <a href="${rejectUrl}" style="background: #991b1b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">رفض الطلب</a>
      </div>
    </div>
  `;

  GmailApp.sendEmail(targetEmail, `مراجعة طلب إجازة: ${data.employeeName} (${id})`, "", {
    htmlBody: htmlBody,
    attachments: [pdfBlob]
  });
}
