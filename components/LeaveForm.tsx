
import React, { useState, useEffect } from 'react';
import { LeaveType, Employee } from '../types';

interface LeaveFormProps {
  employees: Employee[];
  isLoading: boolean;
  isSyncing?: boolean;
  onRefreshEmployees?: () => Promise<void>;
  lastSyncTime?: Date | null;
  submitterEmail?: string;
  onOpenAccountModal?: () => void;
  onAccountSelected?: (email: string, employee?: Employee) => void;
  onSubmit: (data: any) => void;
}

export const LeaveForm: React.FC<LeaveFormProps> = ({ 
  employees, 
  isLoading, 
  isSyncing = false,
  onRefreshEmployees,
  lastSyncTime,
  submitterEmail = '',
  onOpenAccountModal,
  onAccountSelected,
  onSubmit 
}) => {
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [formData, setFormData] = useState({
    issueDate: getTodayStr(), // تاريخ التحرير
    employeeName: '',
    employeeCode: '',
    jobTitle: '',
    employeeEmail: '',
    department: '', 
    leaveType: LeaveType.ANNUAL,
    startDate: '',
    daysCount: 1,
    endDate: '',
    reason: '',
    annualBalance: 0
  });

  // حالة بوابة الحساب المباشرة في النموذج
  const [gateSelectedCode, setGateSelectedCode] = useState('');
  const [gateEmail, setGateEmail] = useState('');
  const [gateError, setGateError] = useState('');

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const autoFillEmployee = (key: 'code' | 'name', value: string) => {
    const emp = employees.find(e => e[key] === value);
    if (emp) {
      setFormData(prev => ({
        ...prev,
        employeeCode: emp.code,
        employeeName: emp.name,
        department: emp.dept,
        jobTitle: emp.title || prev.jobTitle || 'موظف',
        annualBalance: emp.annualBalance !== undefined ? emp.annualBalance : 0
      }));
    } else {
      setFormData(prev => ({ ...prev, [key === 'code' ? 'employeeCode' : 'employeeName']: value }));
    }
  };

  useEffect(() => {
    if (formData.startDate && formData.daysCount > 0) {
      const start = new Date(formData.startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + (Number(formData.daysCount) - 1));
      
      const y = end.getFullYear();
      const m = String(end.getMonth() + 1).padStart(2, '0');
      const d = String(end.getDate()).padStart(2, '0');
      setFormData(prev => ({ ...prev, endDate: `${y}-${m}-${d}` }));
    }
  }, [formData.startDate, formData.daysCount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'employeeCode') autoFillEmployee('code', value);
    else if (name === 'employeeName') autoFillEmployee('name', value);
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      submitterEmail: submitterEmail ? submitterEmail.trim() : '', // يتم تسجيله تلقائياً بحساب Google في المتصفح مثل Google Forms
      displayIssueDate: formatDateDisplay(formData.issueDate),
      displayStartDate: formatDateDisplay(formData.startDate),
      displayEndDate: formatDateDisplay(formData.endDate)
    });
  };

  const inputClasses = "w-full px-5 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#1e3a8a] focus:ring-0 transition-all outline-none text-sm font-bold text-gray-700 placeholder:text-gray-300 shadow-sm";
  const labelClasses = "block text-sm font-black text-[#1e3a8a] mb-2 pr-1";

  // فحص هل عدد الأيام يتجاوز الرصيد السنوي
  const isExceedingBalance = formData.leaveType === LeaveType.ANNUAL && 
    formData.annualBalance !== undefined && 
    Number(formData.daysCount) > formData.annualBalance && 
    Boolean(formData.employeeCode);

  const hasEmail = Boolean(submitterEmail && submitterEmail.trim());

  const handleGateConfirm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = gateEmail.trim().toLowerCase();
    if (!clean) {
      setGateError('يرجى اختيار موظف من القائمة أو كتابة البريد الإلكتروني');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clean)) {
      setGateError('صيغة البريد الإلكتروني غير صحيحة (مثال: user@dakahlia.net)');
      return;
    }
    setGateError('');
    const matchedEmp = employees.find(em => em.code === gateSelectedCode);
    if (matchedEmp) {
      autoFillEmployee('code', matchedEmp.code);
    }
    if (onAccountSelected) {
      onAccountSelected(clean, matchedEmp);
    }
  };

  const handleGateSelectEmp = (code: string) => {
    setGateSelectedCode(code);
    if (!code) return;
    const emp = employees.find(em => em.code === code);
    if (emp) {
      setGateEmail(`emp.${emp.code}@dakahlia.net`);
      setGateError('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      {/* شريط المزامنة مع شيت Google المباشر */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-3xl shadow-lg border border-blue-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-green-400">
            <i className={`fas fa-table text-lg ${isSyncing ? 'fa-spin' : ''}`}></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm">مزامنة الموظفين مع شيت Google</span>
              <span className="bg-green-500/20 text-green-300 border border-green-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                تبويب: data
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              تم تحميل <strong className="text-white font-mono">{employees.length}</strong> موظف برصيدهم السنوي مباشرة من الشيت
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastSyncTime && (
            <span className="text-[11px] text-blue-200 font-medium hidden sm:inline">
              آخر تحديث: {lastSyncTime.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {onRefreshEmployees && (
            <button
              type="button"
              onClick={onRefreshEmployees}
              disabled={isSyncing}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/20 disabled:opacity-50"
              title="سحب أحدث التعديلات من الشيت الآن"
            >
              <i className={`fas fa-sync-alt ${isSyncing ? 'fa-spin text-yellow-300' : ''}`}></i>
              <span>{isSyncing ? 'جاري المزامنة...' : 'مزامنة الآن'}</span>
            </button>
          )}
        </div>
      </div>

      {/* الحالة 1: لم يتم اختيار الحساب بعد (بوابة إجبارية تمنع ظهور أو كتابة أي حقول) */}
      {!hasEmail ? (
        <div className="bg-gradient-to-b from-amber-50/90 via-orange-50/40 to-white rounded-3xl border-2 border-amber-300 shadow-2xl p-6 sm:p-10 space-y-6 text-right">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-amber-200/80 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 shrink-0">
              <i className="fas fa-user-lock"></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-amber-950">
                  الخطوة الأولى الإجبارية: تحديد حساب مقدم الطلب
                </h3>
                <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm animate-pulse">
                  إجباري قبل إدخال أي بيانات
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 mt-1.5 font-medium leading-relaxed">
                يُمنع كتابة أو إدخال أي بيانات في نموذج الإجازات قبل اختيار الحساب، وذلك لضمان تسجيل وتوثيق الطلب باسمك في شيت Google وإرسال الإشعارات بسجل طلباتك حصرياً.
              </p>
            </div>
          </div>

          <form onSubmit={handleGateConfirm} className="space-y-6 max-w-xl mx-auto py-2">
            {gateError && (
              <div className="p-4 bg-red-100/80 border-r-4 border-red-600 rounded-2xl text-xs text-red-900 font-black animate-in fade-in duration-200 flex items-center gap-2">
                <i className="fas fa-exclamation-circle text-base text-red-600"></i>
                <span>{gateError}</span>
              </div>
            )}

            {/* الخيار 1: اختيار موظف من موظفي المخازن */}
            <div className="bg-white p-5 rounded-2xl border-2 border-amber-200/80 shadow-sm space-y-2">
              <label className="block text-xs sm:text-sm font-black text-[#1e3a8a]">
                <i className="fas fa-users ml-2 text-blue-600"></i>
                1. اختر اسمك أو كودك من موظفي المخازن المعتمدين:
              </label>
              <select
                value={gateSelectedCode}
                onChange={(e) => handleGateSelectEmp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-xs sm:text-sm font-bold text-gray-800 bg-gray-50 focus:bg-white focus:border-[#1e3a8a] outline-none transition-all"
              >
                <option value="">-- اضغط هنا لاختيار الموظف --</option>
                {employees.map(emp => (
                  <option key={emp.code} value={emp.code}>
                    {emp.name} ({emp.dept} - كود: {emp.code}) {emp.annualBalance !== undefined ? `[رصيد: ${emp.annualBalance}]` : ''}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-gray-500">
                * عند اختيار الموظف سيتم تعبئة بريده وبياناته تلقائياً.
              </p>
            </div>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-amber-200"></div>
              <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full">أو</span>
              <div className="flex-1 h-px bg-amber-200"></div>
            </div>

            {/* الخيار 2: كتابة البريد يدوياً */}
            <div className="bg-white p-5 rounded-2xl border-2 border-amber-200/80 shadow-sm space-y-2">
              <label className="block text-xs sm:text-sm font-black text-[#1e3a8a]">
                <i className="fas fa-envelope ml-2 text-blue-600"></i>
                2. أو اكتب بريدك الإلكتروني يدوياً:
              </label>
              <input
                type="email"
                value={gateEmail}
                onChange={(e) => {
                  setGateEmail(e.target.value);
                  setGateError('');
                }}
                placeholder="مثال: name@dakahlia.net"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-xs sm:text-sm font-mono font-bold text-gray-800 bg-gray-50 focus:bg-white focus:border-[#1e3a8a] outline-none text-left"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-[#1e3a8a] hover:bg-blue-900 active:scale-[0.98] text-white rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3"
            >
              <i className="fas fa-unlock-alt"></i>
              <span>تأكيد الحساب وفتح نموذج الإجازات</span>
            </button>
          </form>
        </div>
      ) : (
        /* الحالة 2: تم اختيار الحساب وتأكيده - يظهر النموذج الكامل */
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
          {/* شريط حساب Google المعتمد */}
          <div className="p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border bg-slate-50 border-slate-200/90">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-white bg-blue-600">
                <i className="fab fa-google text-lg"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-900">حساب مقدم الطلب (المعتمد):</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                    تم التحديد بنجاح
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  الحساب المعتمد لهذا الطلب: <strong className="font-mono text-blue-900 font-bold" dir="ltr">{submitterEmail}</strong> (يُسجل باسم منشئ الطلب)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
              {onOpenAccountModal && (
                <button
                  type="button"
                  onClick={onOpenAccountModal}
                  className="text-xs px-3.5 py-2 rounded-xl font-black shadow-sm transition-all flex items-center gap-1.5 text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 border border-blue-200"
                >
                  <i className="fas fa-user-circle text-xs"></i>
                  <span>تبديل الحساب</span>
                </button>
              )}
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold">
                <i className="fas fa-check-circle text-emerald-600"></i>
                <span>مفعل</span>
              </div>
            </div>
          </div>

          {/* حقل تاريخ التحرير يدوياً */}
          <div className="p-6 bg-blue-50/20 rounded-3xl border-2 border-blue-100/50">
            <label className={labelClasses}><i className="fas fa-calendar-day ml-2 text-blue-500"></i> تحريراً في (تاريخ الطلب)</label>
            <div className="max-w-xs">
              <input type="date" name="issueDate" required className={inputClasses} value={formData.issueDate} onChange={handleChange} />
            </div>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <label className={labelClasses}><i className="fas fa-id-card ml-2 text-blue-300"></i> كود الموظف (من الشيت)</label>
          <input 
            list="codes-list"
            name="employeeCode" 
            required 
            placeholder="ابحث بالكود..." 
            className={inputClasses} 
            value={formData.employeeCode} 
            onChange={handleChange} 
          />
          <datalist id="codes-list">
            {employees.map(emp => (
              <option key={emp.code} value={emp.code}>
                {emp.name} - {emp.dept} {emp.annualBalance !== undefined ? `(رصيد: ${emp.annualBalance})` : ''}
              </option>
            ))}
          </datalist>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className={labelClasses}><i className="fas fa-user ml-2 text-blue-300"></i> اسم الموظف (من الشيت)</label>
            {formData.employeeCode && (
              <span className={`text-xs px-3 py-1 rounded-full font-black flex items-center gap-1 ${
                formData.annualBalance > 0 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-gray-100 text-gray-700'
              }`}>
                <i className="fas fa-wallet text-[10px]"></i>
                الرصيد السنوي للشيت: <strong className="font-mono">{formData.annualBalance}</strong> يوم
              </span>
            )}
          </div>
          <input 
            list="names-list"
            name="employeeName" 
            required 
            placeholder="ابحث بالاسم..." 
            className={inputClasses} 
            value={formData.employeeName} 
            onChange={handleChange} 
          />
          <datalist id="names-list">
            {employees.map(emp => (
              <option key={emp.name} value={emp.name}>
                كود: {emp.code} - {emp.dept} {emp.annualBalance !== undefined ? `(رصيد: ${emp.annualBalance})` : ''}
              </option>
            ))}
          </datalist>

          {(formData.employeeCode === '70335' || formData.employeeName.includes('حمدان') || formData.employeeEmail?.toLowerCase() === 'ahmed.hamdan@dakahlia.net') && (
            <div className="mt-2.5 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 font-bold flex items-center gap-2 animate-in fade-in duration-200">
              <i className="fas fa-shield-alt text-amber-600 text-sm"></i>
              <span>استثناء إداري خاص بمدير المخازن (أ/ أحمد حمدان): سيتم توجيه هذا الطلب للاعتماد المباشر من أ/ عبد الهادي صالح (<strong className="font-mono text-blue-900" dir="ltr">abdelhady.saleh@dakahlia.net</strong>).</span>
            </div>
          )}
        </div>
        
        <div>
          <label className={labelClasses}><i className="fas fa-briefcase ml-2 text-blue-300"></i> الوظيفة</label>
          <input 
            type="text" 
            name="jobTitle" 
            required 
            placeholder="المسمى الوظيفي" 
            className={inputClasses} 
            value={formData.jobTitle} 
            onChange={handleChange} 
          />
        </div>

        <div>
          <label className={labelClasses}><i className="fas fa-building ml-2 text-blue-300"></i> القسم (تلقائي من الشيت)</label>
          <input 
            type="text" 
            name="department" 
            required 
            className={inputClasses + " bg-gray-100 pointer-events-none font-bold text-[#1e3a8a]"} 
            value={formData.department} 
            readOnly 
          />
        </div>

        <div>
          <label className={labelClasses}><i className="fas fa-list-ul ml-2 text-blue-300"></i> نوع الإجازة</label>
          <select name="leaveType" required className={inputClasses} value={formData.leaveType} onChange={handleChange}>
            {Object.values(LeaveType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-blue-50/30 rounded-[2rem] border-2 border-dashed border-blue-100">
        <div>
          <label className={labelClasses}><i className="fas fa-calendar-plus ml-2 text-blue-500"></i> تاريخ البداية</label>
          <input type="date" name="startDate" required className={inputClasses} value={formData.startDate} onChange={handleChange} />
        </div>
        <div>
          <label className={labelClasses}><i className="fas fa-hashtag ml-2 text-blue-500"></i> عدد الأيام المطلوبة</label>
          <input type="number" name="daysCount" min="1" required className={inputClasses} value={formData.daysCount} onChange={handleChange} />
          {isExceedingBalance && (
            <div className="text-[11px] text-red-600 font-bold mt-1.5 flex items-center gap-1 bg-red-50 p-2 rounded-lg border border-red-200">
              <i className="fas fa-exclamation-triangle"></i>
              <span>الأيام المطلوبة ({formData.daysCount}) تتجاوز الرصيد السنوي ({formData.annualBalance})</span>
            </div>
          )}
        </div>
        <div>
          <label className={labelClasses}><i className="fas fa-calendar-check ml-2 text-green-500"></i> تاريخ العودة (تلقائي)</label>
          <div className="w-full px-5 py-3 rounded-xl border-2 border-green-200 bg-white text-green-700 text-sm font-black flex items-center shadow-sm">
            {formatDateDisplay(formData.endDate) || 'يحدد عند اختيار البداية'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelClasses}><i className="fas fa-envelope ml-2 text-blue-300"></i> البريد الإلكتروني للموظف صاحب الإجازة</label>
          </div>
          <input 
            type="email" 
            name="employeeEmail" 
            required 
            placeholder="employee@dakahlia.net" 
            className={inputClasses} 
            value={formData.employeeEmail} 
            onChange={handleChange} 
          />
          <span className="text-[11px] text-gray-400 mt-1 block">
            * هذا البريد الشخصي للموظف صاحب الإجازة لإرسال الموافقة النهائية له.
          </span>
        </div>
        <div>
          <label className={labelClasses}><i className="fas fa-comment-dots ml-2 text-blue-300"></i> ملاحظات إضافية</label>
          <input type="text" name="reason" placeholder="أي تفاصيل أخرى..." className={inputClasses} value={formData.reason} onChange={handleChange} />
        </div>
      </div>

      <div className="pt-6">
        <button 
          type="submit" 
          disabled={isLoading || !hasEmail}
          className="group w-full py-5 bg-[#1e3a8a] text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-blue-900/20 hover:bg-blue-900 hover:scale-[1.01] transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? (
            <>
              <i className="fas fa-circle-notch fa-spin"></i>
              <span>جاري معالجة الطلب وإرسال إشعار للمدير...</span>
            </>
          ) : !hasEmail ? (
            <>
              <i className="fas fa-lock"></i>
              <span>النموذج مقفل: يجب تحديد البريد الإلكتروني أولاً</span>
            </>
          ) : (
            <>
              <i className="fas fa-file-export group-hover:translate-x-[-5px] transition-transform"></i>
              <span>إرسال الطلب (F-HR-601)</span>
            </>
          )}
        </button>
      </div>
    </form>
  )}
</div>
  );
};
