
import React from 'react';

export const SetupGuide: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="border-l-4 border-blue-600 pl-4">
        <h2 className="text-2xl font-bold text-gray-800 italic">دليل تفعيل نظام التوجيه الديناميكي</h2>
        <p className="text-gray-500 mt-1">كيفية ربط كل قسم بالمدير المباشر المسؤول عنه.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
        <h3 className="font-black text-[#1e3a8a] flex items-center gap-2">
          <i className="fas fa-sitemap"></i>
          ضبط هيكل المديرين في Apps Script
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          في ملف <code className="bg-gray-100 px-2 py-1 rounded text-red-600">Code.gs</code>، ابحث عن قسم <code className="bg-gray-100 px-2 py-1 rounded font-mono">DEPARTMENTS</code>. 
          يجب عليك كتابة البريد الإلكتروني لكل مدير أمام القسم الخاص به كما هو موضح أدناه:
        </p>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-[11px] font-mono overflow-x-auto">
{`DEPARTMENTS: {
  "مخزن المنتج التام": {
    managerEmail: "إيميل_مدير_المنتج@dakahlia.net",
    managerName: "أ/ اسم المدير"
  },
  "مخازن قطع الغيار": {
    managerEmail: "إيميل_مدير_القطع@dakahlia.net",
    managerName: "أ/ اسم المدير"
  }
  // وهكذا لبقية الأقسام...
}`}
        </pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
          <h4 className="font-bold text-blue-800 mb-2">مدير الإدارة والموارد البشرية</h4>
          <p className="text-xs text-blue-700">
            تم ضبطهما كجهات موحدة. أي طلب (من أي قسم) سيصل إليهما بعد موافقة المدير المباشر أولاً. 
            تعديل إيميلاتهم يتم من قسم <code className="font-mono">FINAL_APPROVERS</code>.
          </p>
        </div>
        <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
          <h4 className="font-bold text-green-800 mb-2">تأكيد تسمية القوالب</h4>
          <p className="text-xs text-green-700">
            تأكد أن ملف الـ HTML في محرر جوجل يسمى <code className="font-mono font-bold">EmailTemplates</code> (بدون أي لواحق) ليعمل توليد الـ PDF بنجاح.
          </p>
        </div>
      </div>
    </div>
  );
};
