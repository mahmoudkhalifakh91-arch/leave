
import React from 'react';

export const SetupGuide: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="border-r-4 border-blue-600 pr-4">
        <h2 className="text-2xl font-bold text-gray-800">دليل النظام والمزامنة الحية مع Google Sheets</h2>
        <p className="text-gray-500 mt-1">شرح كيفية سحب بيانات الموظفين وتتبع حساب Google المفتوح تلقائياً.</p>
      </div>

      {/* قسم المزامنة مع الشيت */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-8 rounded-3xl border border-emerald-700 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xl flex items-center gap-2 text-emerald-300">
            <i className="fas fa-file-excel text-2xl"></i>
            المزامنة اللحظية مع شيت (تصريح اجازات - تبويب data)
          </h3>
          <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold">
            مُفعل تلقائياً
          </span>
        </div>

        <p className="text-sm text-emerald-100 leading-relaxed">
          يقوم النظام بسحب بيانات الموظفين مباشرة من جدول بيانات Google المعتمد دون الحاجة إلى تثبيت أي بيانات داخل الكود:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-white/10 p-4 rounded-xl border border-white/15">
            <span className="text-emerald-300 font-bold block mb-1">Spreadsheet ID:</span>
            <span className="text-white select-all break-all">1n2sp5TNNGL3M5_LRNJ7IMLXXWoH6-kL8r4eGZokISCs</span>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/15">
            <span className="text-emerald-300 font-bold block mb-1">اسم التبويب (Tab Name):</span>
            <span className="text-white text-base font-bold">data</span>
          </div>
        </div>

        <div className="bg-black/20 p-4 rounded-xl border border-white/10 text-xs">
          <strong className="text-yellow-300 block mb-1 font-sans font-bold">ترتيب أعمدة الشيت المقروءة تلقائياً:</strong>
          <ul className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center mt-2 font-sans">
            <li className="bg-white/10 p-2 rounded">عمود A: <strong>كود الموظف</strong></li>
            <li className="bg-white/10 p-2 rounded">عمود B: <strong>اسم الموظف</strong></li>
            <li className="bg-white/10 p-2 rounded">عمود C: <strong>القسم</strong></li>
            <li className="bg-white/10 p-2 rounded">عمود D: <strong>الوظيفة</strong></li>
            <li className="bg-white/10 p-2 rounded">عمود E: <strong>الرصيد السنوي</strong></li>
          </ul>
        </div>
      </div>

      {/* قسم حساب Google المنشئ */}
      <div className="bg-amber-50 p-8 rounded-3xl border-2 border-amber-200 shadow-sm space-y-4">
        <h3 className="font-black text-amber-900 flex items-center gap-2 text-lg">
          <i className="fas fa-user-shield text-amber-600 text-xl"></i>
          معرفة حساب Google المفتوح (منشئ الإجازة)
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          بناءً على طلبكم، تم فصل <strong>"البريد الإلكتروني للموظف صاحب الإجازة"</strong> عن <strong>"حساب Google المفتوح حالياً"</strong> الذي قام بإنشاء وتقديم الطلب:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-amber-200">
            <h4 className="font-black text-sm text-[#1e3a8a] mb-1">١. في كود Google Apps Script:</h4>
            <p className="text-xs text-gray-600">
              يتم استدعاء <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-red-600">Session.getActiveUser().getEmail()</code> لأخذ بريد الجيميل الفعلي للمستخدم الذي نفذ العملية وحفظه في سجل الطلب.
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-200">
            <h4 className="font-black text-sm text-[#1e3a8a] mb-1">٢. في إيميل الإشعار المرسل للمدير:</h4>
            <p className="text-xs text-gray-600">
              يصل للمدير المباشر في نص الإيميل وقالب الـ PDF تنبيه صريح يوضح: <strong>"تم إنشاء هذا الطلب بواسطة الحساب: [إيميل_الجيميل]"</strong> لتوضيح المسؤولية الإدارية بدقة.
            </p>
          </div>
        </div>
      </div>

      {/* هيكل المديرين */}
      <div className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
        <h3 className="font-black text-[#1e3a8a] flex items-center gap-2">
          <i className="fas fa-sitemap"></i>
          توزيع إيميلات المديرين بالأقسام واستثناء مدير المخازن
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          في ملف <code className="bg-gray-100 px-2 py-1 rounded text-red-600">Code.gs</code>، يتم توجيه كل قسم لمديره تلقائياً، مع تطبيق استثناء خاص بمدير المخازن:
        </p>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1 font-bold">
          <div className="flex items-center gap-2 text-amber-950 font-black text-sm">
            <i className="fas fa-exclamation-triangle text-amber-600"></i>
            استثناء إداري خاص بمدير المخازن (أ/ أحمد حمدان):
          </div>
          <div>
            الطلب الخاص بمدير المخازن <span className="font-mono" dir="ltr">ahmed.hamdan@dakahlia.net</span> (كود 70335) يوجه تلقائياً إلى مديره المباشر المعتمد عليه: <span className="font-mono text-blue-900 font-black" dir="ltr">abdelhady.saleh@dakahlia.net</span> (أ/ عبد الهادي صالح - المشرف العام).
          </div>
        </div>

        <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-[11px] font-mono overflow-x-auto text-left" dir="ltr">
{`// استثناء خاص بمدير المخازن:
WAREHOUSE_DIRECTOR_EXCEPTION: {
  directorEmail: "ahmed.hamdan@dakahlia.net",
  managerEmail: "abdelhady.saleh@dakahlia.net", // أ/ عبد الهادي صالح
  managerName: "أ/ عبد الهادي صالح"
},

DEPARTMENTS: {
  "التخطيط و المتابعة": { managerEmail: "ahmed.hamdan@dakahlia.net", managerName: "أ/ احمد حمدان" },
  "إدارة المخازن": { managerEmail: "ahmed.hamdan@dakahlia.net", managerName: "أ/ احمد حمدان" },
  "الخامات": { managerEmail: "raw.store.mgr@dakahlia.net", managerName: "أ/ احمد كمال" },
  "المنتج التام": { managerEmail: "finished.store@dakahlia.net", managerName: "أ/ محمود غالى" },
  "المخازن العامة": { managerEmail: "general.store@dakahlia.net", managerName: "أ/ رمضان زينهم" },
  "حركة المعدات": { managerEmail: "equipment.mgr@dakahlia.net", managerName: "أ/ ايمن عليوه" }
},

// مسؤولي الموارد البشرية (وصول الإشعار لأكثر من شخص):
FINAL_APPROVERS: {
  DEPT_HEAD: { email: "ahmed.hamdan@dakahlia.net", name: "أ/ مدير الاداره" },
  HR: {
    emails: [
      "sadat.planning.officer@dakahlia.net",
      "hr1@dakahlia.net", // الإيميل الثاني
      "hr2@dakahlia.net"  // الإيميل الثالث
    ],
    name: "إدارة الموارد البشرية"
  }
}`}
        </pre>
      </div>
    </div>
  );
};
