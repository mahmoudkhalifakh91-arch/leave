
import React, { useState, useEffect } from 'react';
import { LeaveType } from '../types';

interface Employee {
  code: string;
  name: string;
  dept: string;
  title: string;
}

const EMPLOYEES: Employee[] = [
  { code: "70250", name: "عبدالهادى محمد صالح خالد", dept: "إدارة المخازن", title: "مدير اللوجستيه" },
  { code: "71024", name: "مصطفى اسماعيل محمود العبد", dept: "إدارة المخازن", title: "مدير المخازن" },
  { code: "70335", name: "احمد محمد عبدالرحمن حمدان", dept: "التخطيط و المتابعة", title: "رئيس قسم التخطيط" },
  { code: "101105", name: "اسلام خالد عبدالفتاح عبدربه", dept: "التخطيط و المتابعة", title: "أمين مخزن أول" },
  { code: "71142", name: "محمود عبدالمجيب عبدالحفيظ خليفه", dept: "التخطيط و المتابعة", title: "مسؤول تخطيط ومراقبة المخزون" },
  { code: "101103", name: "احمد كمال محمود حسين", dept: "الخامات", title: "رئيس قسم مخازن الخامات" },
  { code: "70434", name: "أحمد فرحات قاسم سعيد", dept: "الخامات", title: "مشرف مخازن" },
  { code: "70430", name: "كامل ممدوح كامل محمد", dept: "الخامات", title: "مشرف مخازن" },
  { code: "70616", name: "محمود عبدالفتاح رمضان حنفى", dept: "الخامات", title: "أمين مخزن أول" },
  { code: "70966", name: "إسلام هلال عبدالمعز أبو شنب", dept: "الخامات", title: "أمين مخزن" },
  { code: "71002", name: "مصطفى أشرف عبد الجليل علام", dept: "الخامات", title: "أمين مخزن" },
  { code: "71039", name: "عبدالله حامد محمد الشرقاوى", dept: "الخامات", title: "أمين مخزن" },
  { code: "71093", name: "أسامه عبدالعاطى جلال إبراهيم عدوى", dept: "الخامات", title: "أمين مخزن" },
  { code: "71118", name: "محمود ناصر محمد الطاهر الصعيدى", dept: "الخامات", title: "أمين مخزن" },
  { code: "71136", name: "أحمد مختار رفاعى محمد عيسوى", dept: "الخامات", title: "أمين مخزن" },
  { code: "70573", name: "محمد إبراهيم رزق خليل", dept: "الخامات", title: "عامل خدمات" },
  { code: "70436", name: "محمود محمد عبدالسميع غالى", dept: "المنتج التام", title: "رئيس قسم المنتج التام" },
  { code: "70290", name: "علاء محمد محمد هلال البحيرى", dept: "المنتج التام", title: "مسئول أول خروج بضاعة" },
  { code: "70455", name: "أحمد توفيق صالح عبدالله", dept: "المنتج التام", title: "مسئول أول خروج بضاعة" },
  { code: "70291", name: "سامح أحمد السعيد أحمد فايد", dept: "المنتج التام", title: "مشرف مخازن" },
  { code: "70499", name: "محمد عبدالرازق الرفاعى أحمد", dept: "المنتج التام", title: "مشرف مخازن" },
  { code: "70400", name: "على حسنين على حسنين", dept: "المنتج التام", title: "مشرف مخازن" },
  { code: "70498", name: "عبدالله محمد أحمد طايل", dept: "المنتج التام", title: "أمين مخزن" },
  { code: "70053", name: "محمد يسرى عبد الفتاح نعيم", dept: "المنتج التام", title: "أمين مخزن" },
  { code: "71091", name: "خالد محمد عيد عبدالمجيد", dept: "المنتج التام", title: "أمين مخزن" },
  { code: "71090", name: "رمضان عبدالجيد عبدربه عطا يا", dept: "المنتج التام", title: "أمين مخزن" },
  { code: "71099", name: "أحمد إبراهيم محمد رضوان", dept: "المنتج التام", title: "أمين مخزن" },
  { code: "70731", name: "هاني فراج عبدالغفور عبدالغنى", dept: "المنتج التام", title: "عامل خدمات" },
  { code: "70789", name: "إبراهيم حسن محروس العشماوى", dept: "المنتج التام", title: "عامل خدمات" },
  { code: "70090", name: "رمضان زينهم على زينهم العتر", dept: "المخازن العامة", title: "رئيس قسم المخازن العامة" },
  { code: "70336", name: "صبحي محمد جمعة ابوحسن", dept: "المخازن العامة", title: "مشرف مخازن" },
  { code: "70369", name: "محمد جلال امام عطالله", dept: "المخازن العامة", title: "أمين مخزن أول" },
  { code: "70289", name: "وليد عطية محمد سالم", dept: "المخازن العامة", title: "أمين مخزن أول" },
  { code: "70314", name: "فتح جبر عبداللطيف طايل", dept: "المخازن العامة", title: "أمين مخزن" },
  { code: "70565", name: "محمد مصطفى محمد عبدالعظيم", dept: "المخازن العامة", title: "أمين مخزن" },
  { code: "71059", name: "أحمد جمال سليمان القواس", dept: "المخازن العامة", title: "أمين مخزن" },
  { code: "70633", name: "محمد عيد اسماعيل حماد", dept: "المخازن العامة", title: "عامل خدمات" },
  { code: "70823", name: "أيمن محمد النادي محمد عليوه", dept: "حركة المعدات", title: "رئيس قسم حركة المعدات" },
  { code: "70255", name: "عبدالصادق محمد عبدالصادق رزق", dept: "حركة المعدات", title: "سائق كلارك" },
  { code: "70359", name: "أسامه عبدالمحسن عبدالعاطي غنيم", dept: "حركة المعدات", title: "سائق كلارك" },
  { code: "70351", name: "أحمد هاشم محمود عامر", dept: "حركة المعدات", title: "سائق كلارك" },
  { code: "70256", name: "سمير معتمد عبدالفتاح النزلاوى", dept: "حركة المعدات", title: "سائق كلارك" },
  { code: "70522", name: "مصطفى لطفى خميس طلبه", dept: "حركة المعدات", title: "سائق كلارك" },
  { code: "70480", name: "أحمد شندى عثمان محمد", dept: "حركة المعدات", title: "سائق كلارك" },
  { code: "70765", name: "علي عبدالعزيز عبدالرازق حلاوه", dept: "حركة المعدات", title: "سائق كلارك" },
  { code: "71003", name: "عمرو عبدالسلام عبدالسلام غباشي", dept: "حركة المعدات", title: "سائق كلارك" },
  { code: "70976", name: "أسامه جمعه السيد عبدالسلام", dept: "حركة المعدات", title: "سائق كلارك" },
  { code: "71028", name: "علاء عادل عبدالمنعم سويدان", dept: "حركة المعدات", title: "سائق كلارك" },
  { code: "70923", name: "أحمد حسني عبدالشكور السمرى", dept: "حركة المعدات", title: "سائق كلارك" },
  { code: "70691", name: "كريم نجاح عدلان خاطر", dept: "حركة المعدات", title: "سائق كلارك" },
  { code: "71163", name: "أحمد محمد سالم علي", dept: "حركة المعدات", title: "سائق كلارك" }
];

interface LeaveFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

export const LeaveForm: React.FC<LeaveFormProps> = ({ onSubmit, isLoading }) => {
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
    reason: ''
  });

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const autoFillEmployee = (key: 'code' | 'name', value: string) => {
    const emp = EMPLOYEES.find(e => e[key] === value);
    if (emp) {
      setFormData(prev => ({
        ...prev,
        employeeCode: emp.code,
        employeeName: emp.name,
        department: emp.dept,
        jobTitle: emp.title
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
      displayIssueDate: formatDateDisplay(formData.issueDate), // إرسال تاريخ التحرير بتنسيق العرض
      displayStartDate: formatDateDisplay(formData.startDate),
      displayEndDate: formatDateDisplay(formData.endDate)
    });
  };

  const inputClasses = "w-full px-5 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-[#1e3a8a] focus:ring-0 transition-all outline-none text-sm font-bold text-gray-700 placeholder:text-gray-300 shadow-sm";
  const labelClasses = "block text-sm font-black text-[#1e3a8a] mb-2 pr-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
      {/* حقل تاريخ التحرير يدوياً */}
      <div className="p-6 bg-blue-50/20 rounded-3xl border-2 border-blue-100/50">
        <label className={labelClasses}><i className="fas fa-calendar-day ml-2 text-blue-500"></i> تحريراً في (تاريخ الطلب)</label>
        <div className="max-w-xs">
          <input type="date" name="issueDate" required className={inputClasses} value={formData.issueDate} onChange={handleChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <label className={labelClasses}><i className="fas fa-id-card ml-2 text-blue-300"></i> كود الموظف</label>
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
            {EMPLOYEES.map(emp => <option key={emp.code} value={emp.code}>{emp.name}</option>)}
          </datalist>
        </div>
        <div className="md:col-span-2">
          <label className={labelClasses}><i className="fas fa-user ml-2 text-blue-300"></i> الاسم الثلاثي للموظف</label>
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
            {EMPLOYEES.map(emp => <option key={emp.name} value={emp.name}>{emp.code}</option>)}
          </datalist>
        </div>
        
        <div>
          <label className={labelClasses}><i className="fas fa-briefcase ml-2 text-blue-300"></i> الوظيفة</label>
          <input type="text" name="jobTitle" required placeholder="المسمى الوظيفي" className={inputClasses + " bg-gray-100 pointer-events-none"} value={formData.jobTitle} readOnly />
        </div>
        <div>
          <label className={labelClasses}><i className="fas fa-building ml-2 text-blue-300"></i> القسم</label>
          <input type="text" name="department" required className={inputClasses + " bg-gray-100 pointer-events-none"} value={formData.department} readOnly />
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
          <label className={labelClasses}><i className="fas fa-envelope ml-2 text-blue-300"></i> البريد الإلكتروني للموظف</label>
          <input type="email" name="employeeEmail" required placeholder="name@dakahlia.net" className={inputClasses} value={formData.employeeEmail} onChange={handleChange} />
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
              <span>جاري معالجة الطلب...</span>
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
