
import React, { useState, useEffect } from 'react';
import { LeaveType, Employee } from '../types';

interface LeaveFormProps {
  employees: Employee[];
  isLoading: boolean;
  isSyncing?: boolean;
  onRefreshEmployees?: () => Promise<void>;
  lastSyncTime?: Date | null;
  submitterEmail?: string;
  canEditSubmitter?: boolean;
  onUpdateSubmitterEmail?: (email: string) => void;
  onSubmit: (data: any) => void;
}

export const LeaveForm: React.FC<LeaveFormProps> = ({ 
  employees, 
  isLoading, 
  isSyncing = false,
  onRefreshEmployees,
  lastSyncTime,
  submitterEmail = 'sadat.planning.officer@dakahlia.net',
  canEditSubmitter = false,
  onUpdateSubmitterEmail,
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

  const [isEditingSubmitter, setIsEditingSubmitter] = useState(false);
  const [tempSubmitterEmail, setTempSubmitterEmail] = useState(submitterEmail);

  useEffect(() => {
    setTempSubmitterEmail(submitterEmail);
  }, [submitterEmail]);

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
      submitterEmail: submitterEmail, // حساب Google المنشئ للطلب
      displayIssueDate: formatDateDisplay(formData.issueDate),
      displayStartDate: formatDateDisplay(formData.startDate),
      displayEndDate: formatDateDisplay(formData.endDate)
    });
  };

  const handleSaveSubmitter = () => {
    if (onUpdateSubmitterEmail && tempSubmitterEmail.trim()) {
      onUpdateSubmitterEmail(tempSubmitterEmail.trim());
    }
    setIsEditingSubmitter(false);
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

      {/* صندوق حساب Google المفتوح (مقدم الطلب) - منفصل عن بريد الموظف */}
      <div className="p-5 bg-amber-50/70 border-2 border-amber-200/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mt-0.5 shadow-sm">
            <i className="fas fa-user-shield text-lg"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-900 uppercase">حساب Google المفتوح (مقدم / منشئ الطلب):</span>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                يظهر تلقائياً للمدير في إيميل الاعتماد
              </span>
            </div>
            
            {isEditingSubmitter && canEditSubmitter ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="email"
                  value={tempSubmitterEmail}
                  onChange={(e) => setTempSubmitterEmail(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border-2 border-amber-400 text-xs font-mono font-bold outline-none bg-white text-gray-800"
                  placeholder="name@dakahlia.net"
                />
                <button
                  type="button"
                  onClick={handleSaveSubmitter}
                  className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700"
                >
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingSubmitter(false)}
                  className="px-2 py-1.5 text-gray-500 text-xs"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="font-mono text-sm font-black text-blue-900 bg-white px-3 py-1 rounded-lg border border-amber-200 shadow-sm" dir="ltr">
                  {submitterEmail}
                </span>
                {canEditSubmitter ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingSubmitter(true)}
                    className="text-xs text-amber-700 hover:text-amber-900 underline font-bold mr-2"
                  >
                    تعديل الحساب (صلاحية المسؤول)
                  </button>
                ) : (
                  <span className="text-[11px] text-gray-500 bg-amber-100/60 px-2 py-0.5 rounded font-bold border border-amber-200/60 flex items-center gap-1">
                    <i className="fas fa-lock text-[10px] text-amber-600"></i>
                    حساب موثق تلقائياً (غير قابل للتعديل)
                  </span>
                )}
              </div>
            )}
            <p className="text-[11px] text-amber-800 mt-1">
              * هذا الحساب هو المسؤول الذي يقوم بإنشاء الطلب حالياً، وهو منفصل تماماً عن البريد الشخصي للموظف بالأسفل.
            </p>
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
