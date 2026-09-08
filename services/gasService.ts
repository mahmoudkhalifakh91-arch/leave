
import { LeaveRequest } from '../types';

/**
 * رابط خدمة Google Apps Script (Web App URL)
 * هام: يجب أن يستبدل الموظف هذا الرابط بالرابط الخاص به بعد النشر.
 */
const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbzUyWkv1-A-147xAFBixeBhApoB6w3TnBZaLrBeDjH7jBp-2ag3RfQcS4cr8qqhgb_KXQ/exec'
export const submitLeaveRequest = async (request: any): Promise<{ success: boolean, requestId?: string, error?: string }> => {
  try {
    // محاولة الاتصال بالسكريبت
    // ملاحظة: نستخدم 'no-cors' لأن Apps Script لا يدعم CORS بالكامل، لكنه سينفذ الكود في الخلفية.
    const response = await fetch(DEFAULT_GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(request),
    });

    // في وضع no-cors لا يمكننا قراءة الاستجابة، لكن سنفترض النجاح إذا اكتمل الطلب.
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
