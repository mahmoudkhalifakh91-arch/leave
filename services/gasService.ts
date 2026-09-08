
import { LeaveRequest, Employee } from '../types';

/**
 * إعدادات الاتصال بـ Google Apps Script و Google Sheets
 */
export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbxvQJUKtSCRzEtt8JXsILGu6x5AGPsFR85PM7jExU2Jj5zG8sDwpyIFzt9ZMc6WBpbyUw/exec';
export const SPREADSHEET_ID = '1n2sp5TNNGL3M5_LRNJ7IMLXXWoH6-kL8r4eGZokISCs';
export const SHEET_DATA_TAB = 'data';

// البيانات الأولية المطابقة تماماً للشيت في الصورة (تستخدم كنسخة احتياطية عند عدم توفر اتصال)
const INITIAL_SHEET_SEED: Employee[] = [
  { code: "70250", name: "عبدالهادى محمد صالح خالد", dept: "إدارة المخازن", title: "مدير اللوجستيه", annualBalance: 0 },
  { code: "70335", name: "أحمد محمد عبدالرحمن حمدان", dept: "التخطيط", title: "رئيس قسم التخطيط", annualBalance: 0 },
  { code: "101105", name: "إسلام خالد عبدالفتاح عبدربه", dept: "التخطيط", title: "أمين مخزن أول", annualBalance: 2 },
  { code: "71142", name: "محمود عبدالمجيب عبدالحفيظ خليفه", dept: "التخطيط", title: "مسؤول تخطيط ومراقبة المخزون", annualBalance: 13.5 },
  { code: "101103", name: "احمد كمال محمود حسين", dept: "الخامات", title: "رئيس قسم مخازن الخامات", annualBalance: 7 },
  { code: "70434", name: "أحمد فرحات قاسم سعيد", dept: "الخامات", title: "مشرف مخازن", annualBalance: 4.75 },
  { code: "70430", name: "كامل ممدوح كامل محمد", dept: "الخامات", title: "مشرف مخازن", annualBalance: 12 },
  { code: "70616", name: "محمود عبدالفتاح رمضان حنفى", dept: "الخامات", title: "أمين مخزن أول", annualBalance: 9.25 },
  { code: "70966", name: "اسلام هلال عبدالمعز ابوشنب", dept: "الخامات", title: "أمين مخزن", annualBalance: 14 },
  { code: "71002", name: "مصطفى اشرف علام", dept: "الخامات", title: "أمين مخزن", annualBalance: 0 },
  { code: "71039", name: "عبدالله حامد محمد فهمي الشرقاوي", dept: "الخامات", title: "أمين مخزن", annualBalance: 10.25 },
  { code: "71093", name: "اسامه عبدالعاطى جلال إبراهيم عدوى", dept: "الخامات", title: "أمين مخزن", annualBalance: 4.5 },
  { code: "71136", name: "احمد مختار رفاعى محمد عيسوى", dept: "الخامات", title: "أمين مخزن", annualBalance: 20 },
  { code: "70573", name: "محمد إبراهيم رزق خليل", dept: "الخامات", title: "عامل خدمات", annualBalance: 22 },
  { code: "70436", name: "محمود محمد عبدالسميع غالى", dept: "المنتج التام", title: "رئيس قسم المنتج التام", annualBalance: 14 },
  { code: "70499", name: "محمد عبدالرازق الرفاعى أحمد", dept: "المنتج التام", title: "مشرف مخازن", annualBalance: 18 },
  { code: "70290", name: "علاء محمد محمد هلال البحيرى", dept: "المنتج التام", title: "مسئول أول خروج بضاعة", annualBalance: 22.25 },
  { code: "70291", name: "سامح أحمد السعيد أحمد فايد", dept: "المنتج التام", title: "مشرف مخازن", annualBalance: 16 }
];

/**
 * الحصول على البريد الإلكتروني لحساب Google المفتوح (مقدم الطلب)
 * يقرأ الحساب التلقائي من رابط الجلسة أو الذاكرة المحلية دون إجبار المستخدم على الاختيار اليدوي
 */
export const getInitialSubmitterEmail = (): string => {
  // 1. فحص معاملات الرابط الصريحة أولاً (مثل: ?email=name@dakahlia.net أو ?user=...)
  if (typeof window !== 'undefined' && window.location) {
    const params = new URLSearchParams(window.location.search);
    const urlEmail = params.get('email') || params.get('u') || params.get('user');
    if (urlEmail && urlEmail.trim()) {
      const clean = urlEmail.trim().toLowerCase();
      localStorage.setItem('active_google_user_email', clean);
      return clean;
    }
  }

  // 2. فحص التخزين المحلي لهذا الجهاز/المتصفح
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('active_google_user_email');
    if (saved && saved.trim()) {
      const clean = saved.trim().toLowerCase();
      // تنظيف فوري: مسح بريد المشرف إذا كان محفوظاً بالخطأ كافتراضي حتى لا يظهر لمن يتصفح من حساب آخر
      if (clean === 'sadat.planning.officer@dakahlia.net') {
        localStorage.removeItem('active_google_user_email');
        return '';
      }
      return clean;
    }
  }

  return '';
};

/**
 * الكشف التلقائي عن حساب Google المفتوح في المتصفح في الخلفية
 * يعمل بنفس أسلوب Google Forms تماماً دون الحاجة لأي تدخل من المستخدم
 */
export const detectActiveGoogleUser = async (): Promise<string> => {
  // أولاً: التحقق من الرابط إذا تم تمرير الإيميل كمعامل تلقائي
  const initial = getInitialSubmitterEmail();
  if (initial) return initial;

  // ثانياً: الاستعلام من خادم Google Apps Script لجلب البريد المرتبط بجلسة المتصفح الحالية
  try {
    const gasUrl = `${DEFAULT_GAS_URL}?action=getActiveUser&t=${Date.now()}`;
    const res = await fetch(gasUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.email && data.email.includes('@')) {
        const clean = data.email.trim().toLowerCase();
        // حماية: لا نقوم بتثبيت بريد المشرف تلقائياً كحساب متصفح
        if (clean !== 'sadat.planning.officer@dakahlia.net') {
          setStoredSubmitterEmail(clean);
          return clean;
        }
      }
    }
  } catch (e) {
    console.log('Google session check (silent):', e);
  }

  return '';
};

/**
 * دالة متوافقة مع الاستدعاءات القديمة
 */
export const getStoredSubmitterEmail = (): string => {
  return getInitialSubmitterEmail();
};

/**
 * تحديث البريد الإلكتروني لحساب Google المفتوح (مقدم الطلب)
 */
export const setStoredSubmitterEmail = (email: string) => {
  if (typeof localStorage !== 'undefined') {
    if (email && email.trim()) {
      localStorage.setItem('active_google_user_email', email.trim().toLowerCase());
    } else {
      localStorage.removeItem('active_google_user_email');
    }
  }
};

/**
 * تسجيل الخروج / مسح الحساب المحفوظ
 */
export const clearStoredSubmitterEmail = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('active_google_user_email');
  }
};

/**
 * مزامنة وسحب بيانات الموظفين من شيت Google (تبويب data)
 */
export const fetchEmployeesFromSheet = async (): Promise<{
  success: boolean;
  employees: Employee[];
  source: 'apps_script' | 'google_sheet_api' | 'cache' | 'seed';
  activeUser?: string;
  error?: string;
}> => {
  // 1. المحاولة الأولى: الاستعلام من Google Apps Script
  try {
    const gasUrl = `${DEFAULT_GAS_URL}?action=getEmployees&t=${Date.now()}`;
    const response = await fetch(gasUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && Array.isArray(result.employees) && result.employees.length > 0) {
        localStorage.setItem('synced_employees_data', JSON.stringify(result.employees));
        localStorage.setItem('synced_employees_timestamp', new Date().toISOString());
        if (result.activeUser && result.activeUser !== 'sadat.planning.officer@dakahlia.net') {
          setStoredSubmitterEmail(result.activeUser);
        }
        return {
          success: true,
          employees: result.employees,
          source: 'apps_script',
          activeUser: result.activeUser
        };
      }
    }
  } catch (err) {
    console.warn('Apps Script fetch failed, attempting direct Google Sheet query...', err);
  }

  // 2. المحاولة الثانية: الاستعلام المباشر من Google Sheets عبر واجهة GViz
  try {
    const gvizUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_DATA_TAB}&t=${Date.now()}`;
    const sheetRes = await fetch(gvizUrl);
    if (sheetRes.ok) {
      const text = await sheetRes.text();
      const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
      if (match && match[1]) {
        const json = JSON.parse(match[1]);
        const rows = json.table?.rows || [];
        
        const parsedEmployees: Employee[] = [];
        for (const r of rows) {
          if (!r.c) continue;
          // العمود B (فهرس 1): الكود
          const codeVal = r.c[1]?.v !== null && r.c[1]?.v !== undefined ? String(r.c[1]?.v).trim() : '';
          // العمود C (فهرس 2): الاسم
          const nameVal = r.c[2]?.v !== null && r.c[2]?.v !== undefined ? String(r.c[2]?.v).trim() : '';
          // العمود D (فهرس 3): القسم
          const deptVal = r.c[3]?.v !== null && r.c[3]?.v !== undefined ? String(r.c[3]?.v).trim() : '';
          // العمود E (فهرس 4): الرصيد السنوي
          const balanceVal = r.c[4]?.v !== null && r.c[4]?.v !== undefined ? Number(r.c[4]?.v) : 0;
          // العمود F (فهرس 5 إن وجد): الوظيفة
          const titleVal = r.c[5]?.v !== null && r.c[5]?.v !== undefined ? String(r.c[5]?.v).trim() : '';

          if (codeVal && nameVal && codeVal !== 'الكود') {
            parsedEmployees.push({
              code: codeVal,
              name: nameVal,
              dept: deptVal || 'عام',
              annualBalance: isNaN(balanceVal) ? 0 : balanceVal,
              title: titleVal || ''
            });
          }
        }

        if (parsedEmployees.length > 0) {
          localStorage.setItem('synced_employees_data', JSON.stringify(parsedEmployees));
          localStorage.setItem('synced_employees_timestamp', new Date().toISOString());
          return {
            success: true,
            employees: parsedEmployees,
            source: 'google_sheet_api'
          };
        }
      }
    }
  } catch (err) {
    console.warn('Direct Google Sheet query failed, falling back to cache...', err);
  }

  // 3. المحاولة الثالثة: التحميل من التخزين المحلي Cached Data
  const cached = localStorage.getItem('synced_employees_data');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return {
          success: true,
          employees: parsed,
          source: 'cache'
        };
      }
    } catch (e) {
      console.error('Failed to parse cached employees', e);
    }
  }

  // 4. البديل الافتراضي: الشيت الأولي
  return {
    success: true,
    employees: INITIAL_SHEET_SEED,
    source: 'seed'
  };
};

/**
 * إرسال طلب الإجازة إلى Google Apps Script
 */
export const submitLeaveRequest = async (request: any): Promise<{ success: boolean, requestId?: string, error?: string }> => {
  try {
    // التأكد من إرفاق بريد منشئ الطلب (حساب الجيميل الحالي)
    const payload = {
      ...request,
      submitterEmail: request.submitterEmail || getStoredSubmitterEmail()
    };

    // إرسال البيانات
    await fetch(DEFAULT_GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      requestId: request.requestId
    };
  } catch (error) {
    console.error('Submission Error:', error);
    return {
      success: false,
      error: 'فشل في الاتصال بخوادم جوجل. تأكد من صحة الرابط المنشور في ملف gasService.ts'
    };
  }
};

