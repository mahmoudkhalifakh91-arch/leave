import React, { useState } from 'react';
import { Employee } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  currentEmail: string;
  employees: Employee[];
  onSave: (email: string) => void;
  onClear?: () => void;
  onClose?: () => void;
  canClose?: boolean;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  currentEmail,
  employees,
  onSave,
  onClear,
  onClose,
  canClose = true
}) => {
  const [emailInput, setEmailInput] = useState(currentEmail || '');
  const [selectedEmpCode, setSelectedEmpCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = emailInput.trim().toLowerCase();
    if (!clean) {
      setError('يرجى كتابة البريد الإلكتروني أو اختيار موظف');
      return;
    }
    // فحص تنسيق البريد الإلكتروني الأساسي
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clean)) {
      setError('صيغة البريد الإلكتروني غير صحيحة (مثال: user@dakahlia.net)');
      return;
    }
    setError('');
    onSave(clean);
  };

  const handleSelectEmployee = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedEmpCode(code);
    if (!code) return;

    const emp = employees.find(em => em.code === code);
    if (emp) {
      setEmailInput(`emp.${emp.code}@dakahlia.net`);
      setError('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-['Tajawal']" dir="rtl">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-l from-[#1e3a8a] to-blue-600 p-6 text-white text-right relative">
          {canClose && onClose && (
            <button 
              type="button"
              onClick={onClose} 
              className="absolute left-6 top-6 text-white/80 hover:text-white transition-colors"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          )}
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-3 border border-white/20">
            <i className="fas fa-user-lock text-2xl text-yellow-400"></i>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black">
              {canClose ? 'تبديل أو تحديد حساب البريد' : 'تسجيل البريد الإلكتروني (إجباري)'}
            </h3>
            {!canClose && (
              <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                مطلوب للمتابعة
              </span>
            )}
          </div>
          <p className="text-xs text-blue-100 mt-1">
            {!canClose 
              ? 'مطلوب إدخال أو تحديد البريد الإلكتروني لفتح نموذج الإجازات وتوثيق طلبك في الشيت باسمك.'
              : 'يرجى إدخال الحساب الذي فتحت منه الرابط لتوثيق معاملاتك وإظهار طلباتك الخاصة بك فقط.'}
          </p>
        </div>

        <form onSubmit={handleConfirm} className="p-6 md:p-8 space-y-6 text-right">
          {!canClose && (
            <div className="p-3.5 bg-amber-50 border-r-4 border-amber-500 rounded-xl text-xs text-amber-900 font-bold flex items-center gap-2.5">
              <i className="fas fa-exclamation-triangle text-amber-600 text-base flex-shrink-0"></i>
              <span>لا يمكن تعبئة أو إرسال أي بيانات في نموذج الإجازات قبل تحديد وتأكيد البريد الإلكتروني.</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border-r-4 border-red-500 rounded-xl text-xs text-red-700 font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              <i className="fas fa-envelope text-blue-500 ml-1"></i> البريد الإلكتروني للمستخدم الحالي (مقدم الطلب)
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                setError('');
              }}
              placeholder="مثال: name@dakahlia.net"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono text-left font-bold text-gray-800"
              dir="ltr"
              autoFocus
            />
            <p className="text-[11px] text-gray-400 mt-1">
              * هذا البريد هو حساب Google المفتوح في جهازك حالياً، وسيتم تسجيل الطلبات باسمه.
            </p>
          </div>

          {employees && employees.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">
                <i className="fas fa-users text-gray-400 ml-1"></i> أو اختر اسمك/كودك من موظفي المخازن للشيت:
              </label>
              <select
                value={selectedEmpCode}
                onChange={handleSelectEmployee}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-gray-50 outline-none focus:border-blue-500"
              >
                <option value="">-- اضغط للاختيار من موظفي الشيت --</option>
                {employees.map(emp => (
                  <option key={emp.code} value={emp.code}>
                    {emp.name} ({emp.dept} - كود: {emp.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100 text-xs text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-blue-950">
              <i className="fas fa-shield-alt text-blue-600"></i>
              خصوصية الحسابات والطلبات:
            </div>
            <p className="text-[11px] text-blue-800">
              - يظهر سجل الطلبات حصرياً للحساب المسجل أعلاه، ولن تظهر طلباتك لأي مستخدم آخر.
            </p>
            <p className="text-[11px] text-blue-800">
              - يمكنك الضغط على <strong>"تبديل الحساب"</strong> في أي وقت في حال استخدام جهاز مشترك.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="submit"
              className="w-full sm:flex-1 py-3.5 bg-[#1e3a8a] text-white font-bold rounded-2xl hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl text-sm"
            >
              <i className="fas fa-check-circle ml-2"></i>
              تأكيد الحساب ومتابعة
            </button>
            {canClose && onClear && currentEmail && (
              <button
                type="button"
                onClick={onClear}
                className="w-full sm:w-auto px-4 py-3.5 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-2xl transition-all text-xs border border-red-200"
                title="مسح الحساب المسجل"
              >
                مسح الحساب
              </button>
            )}
            {canClose && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all text-sm"
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
