
import React, { useState, useEffect } from 'react';
import { LeaveType, Employee } from '../types';

interface LeaveFormProps {
  employees: Employee[];
  isLoading: boolean;
  isSyncing?: boolean;
  onRefreshEmployees?: () => Promise<void>;
  lastSyncTime?: Date | null;
  submitterEmail?: string;
  onSubmit: (data: any) => void;
}

export const LeaveForm: React.FC<LeaveFormProps> = ({ 
  employees, 
  isLoading, 
  isSyncing = false,
  onRefreshEmployees,
  lastSyncTime,
  submitterEmail = '',
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
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

      {/* شريط تسجيل حساب Google تلقائياً من المتصفح (نظام Google Forms تماماً بدون اختيار أو نوافذ يدوية) */}
      <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <i className="fab fa-google text-lg"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-gray-900">تسجيل حساب Google تلقائياً (مثل Google Forms):</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                تسجيل تلقائي
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">
              {submitterEmail ? (
                <>الحساب المفتوح في المتصفح حالياً: <strong className="font-mono text-blue-900 font-bold" dir="ltr">{submitterEmail}</strong> (يُسجل تلقائياً باسم منشئ الطلب)</>
              ) : (
                <>يتم تسجيل البريد الإلكتروني المرتبط بجلسة Google المفتوحة في المتصفح تلقائياً عند إرسال الطلب</>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 font-bold self-stretch sm:self-auto justify-center">
          <i className="fas fa-check-circle text-emerald-600"></i>
          <span>التقاط تلقائي من المتصفح</span>
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
          disabled={isLoading}
          className="group w-full py-5 bg-[#1e3a8a] text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-blue-900/20 hover:bg-blue-900 hover:scale-[1.01] transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:bg-gray-400 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <i className="fas fa-circle-notch fa-spin"></i>
              <span>جاري معالجة الطلب وإرسال إشعار للمدير...</span>
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
  );
};
