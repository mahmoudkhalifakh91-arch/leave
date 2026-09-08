
import React, { useState } from 'react';
import { LeaveRequest, RequestStatus } from '../types';

interface RequestDetailsProps {
  request: LeaveRequest;
  onClose: () => void;
}

const LOCAL_CONFIG_EMAILS: any = {
  DEPARTMENTS: {
    "التخطيط و المتابعة": "ahmed.hamdan@dakahlia.net",
    "إدارة المخازن": "warehouses.mgmt@dakahlia.net",
    "الخامات": "raw.store.mgr@dakahlia.net",
    "المنتج التام": "finished.store@dakahlia.net",
    "قطع الغيار": "spareparts.store@dakahlia.net",
    "المخازن العامة": "general.store@dakahlia.net",
    "حركة المعدات": "equipment.mgr@dakahlia.net"
  },
  DEPT_HEAD: "sadat.planning.officer@dakahlia.net",
  HR: "sadat.planning.officer@dakahlia.net"
};

export const RequestDetails: React.FC<RequestDetailsProps> = ({ request, onClose }) => {
  const [view, setView] = useState<'doc' | 'workflow'>('doc');

  const generateISOPrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const issueDateStr = request.displayIssueDate || new Date().toLocaleDateString('ar-EG');

    const formHtml = (copyName: string) => `
      <div class="form-container">
          <table class="header-table">
              <tr>
                  <td style="width: 25%;">
                      <table class="meta-inner-table">
                          <tr><td>كود الوثيقة</td><td>F-HR-601</td></tr>
                          <tr><td>رقم الإصدار</td><td>٢</td></tr>
                          <tr><td>تاريخ الإصدار</td><td>2025/12/01</td></tr>
                      </table>
                  </td>
                  <td class="title-box">طلب تصريح أجازة - ${copyName}</td>
                  <td class="logo-box">
                      <span class="company-name">الدقهلية للدواجن</span>
                      <img src="https://i.ibb.co/LhyM4vC/dakahlia-logo.png" class="logo-img" />
                  </td>
              </tr>
          </table>
          <div class="types-container">
              <span style="margin: 0 10px; font-size: 8pt; font-weight: bold;">أعتيادية <span class="check-box">${request.leaveType === 'اعتيادية' ? '✔' : ''}</span></span>
              <span style="margin: 0 10px; font-size: 8pt; font-weight: bold;">عارضة <span class="check-box">${request.leaveType === 'عارضة' ? '✔' : ''}</span></span>
              <span style="margin: 0 10px; font-size: 8pt; font-weight: bold;">مرضي <span class="check-box">${request.leaveType === 'مرضي' ? '✔' : ''}</span></span>
          </div>
          <table class="content-table">
              <tr>
                  <td style="width: 55%;"><span class="label">تحريراً في:</span> <span class="value">${issueDateStr}</span></td>
                  <td><span class="label">كود الموظف:</span> <span class="value">${request.employeeCode}</span></td>
              </tr>
              <tr>
                  <td><span class="label">أسم الموظف:</span> <span class="value">${request.employeeName}</span></td>
                  <td><span class="label">القسم:</span> <span class="value">${request.department}</span></td>
              </tr>
              <tr>
                  <td><span class="label">عدد الأيام:</span> <span class="value">${request.daysCount} أيام</span></td>
                  <td><span class="label">من</span> <span class="value">${request.startDate}</span> <span class="label">إلى</span> <span class="value">${request.endDate}</span></td>
              </tr>
          </table>
          <div class="notes-row" style="padding: 6px 12px; border-bottom: 2px solid #000;">
              <span class="label">ملاحظات:</span> <span class="value">${request.reason || '................................'}</span>
          </div>
          <table class="sig-table">
              <tr>
                  <td>
                    الموظف<span class="sig-underline"></span>
                    <div class="stamp-text" style="color: #1e3a8a; border-color: #1e3a8a;">${request.employeeName}</div>
                  </td>
                  <td>
                    المدير المباشر<span class="sig-underline"></span>
                    <div class="stamp-text" style="color: #166534; border-color: #166534;">APPROVED</div>
                    <span class="approver-email">${LOCAL_CONFIG_EMAILS.DEPARTMENTS[request.department] || ''}</span>
                  </td>
                  <td>
                    مدير الإدارة<span class="sig-underline"></span>
                    <div class="stamp-text" style="color: #166534; border-color: #166534;">APPROVED</div>
                    <span class="approver-email">${LOCAL_CONFIG_EMAILS.DEPT_HEAD}</span>
                  </td>
                  <td>
                    الموارد البشرية<span class="sig-underline"></span>
                    <div class="stamp-text" style="color: #1e40af; border-color: #1e40af;">REVIEWED</div>
                    <span class="approver-email">${LOCAL_CONFIG_EMAILS.HR}</span>
                  </td>
              </tr>
          </table>
          <div class="footer">© Created by the Planning Department - Version 2.0 ©</div>
      </div>
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
          <meta charset="UTF-8">
          <title>طباعة نموذج ISO - ${request.id}</title>
          <style>
              @page { size: A4; margin: 8mm; }
              body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; color: #000; background: #fff; line-height: 1.3; }
              .page-wrapper { display: flex; flex-direction: column; gap: 15px; }
              .form-container { border: 2px solid #000; width: 100%; box-sizing: border-box; }
              .header-table { width: 100%; border-collapse: collapse; border-bottom: 2px solid #000; table-layout: fixed; }
              .header-table td { border-left: 2px solid #000; padding: 2px; vertical-align: middle; text-align: center; }
              .header-table td:last-child { border-left: none; }
              .logo-box { width: 35%; text-align: left; padding: 2px 10px !important; }
              .logo-img { height: 30px; vertical-align: middle; }
              .company-name { font-weight: bold; font-size: 10pt; margin-left: 10px; }
              .title-box { font-size: 13pt; font-weight: bold; }
              .meta-inner-table { width: 100%; border-collapse: collapse; font-size: 7pt; }
              .meta-inner-table td { border: none; padding: 1px; text-align: center; }
              .types-container { padding: 4px; border-bottom: 2px solid #000; text-align: center; }
              .check-box { display: inline-block; width: 14px; height: 14px; border: 1.5px solid #000; vertical-align: middle; margin-right: 4px; text-align: center; line-height: 12px; font-size: 10pt; }
              .content-table { width: 100%; border-collapse: collapse; }
              .content-table td { padding: 5px 12px; border-bottom: 1px solid rgba(0,0,0,0.05); font-size: 9.5pt; height: 24px; }
              .label { font-weight: bold; margin-left: 8px; }
              .value { color: #1e3a8a; font-weight: bold; font-family: monospace; font-size: 10pt; }
              .sig-table { width: 100%; border-collapse: collapse; }
              .sig-table td { width: 25%; text-align: center; font-weight: bold; padding: 5px 0 25px 0; border-left: none; vertical-align: top; font-size: 9pt; }
              .sig-underline { display: block; margin-top: 15px; border-top: 1px dashed #000; width: 70%; margin: 5px auto; }
              .stamp-text { font-size: 7pt; font-weight: bold; font-family: monospace; border: 1px solid #cbd5e1; padding: 2px 4px; display: inline-block; margin-top: 2px; border-radius: 3px; }
              .approver-email { font-size: 6.5pt; font-family: monospace; color: #475569; margin-top: 2px; display: block; font-weight: bold; overflow-wrap: break-word; line-height: 1; }
              .footer { text-align: center; padding: 4px; font-size: 7pt; font-weight: bold; border-top: 1px solid #000; color: #64748b; }
              .cut-line { width: 100%; border-top: 2px dashed #999; margin: 10px 0; text-align: center; position: relative; }
              .cut-line:after { content: "✂ يتم القص من هنا"; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #fff; padding: 0 10px; font-size: 8pt; color: #999; }
              @media print { .no-print { display: none; } }
          </style>
      </head>
      <body>
          <div class="no-print" style="background: #f1f5f9; padding: 10px; text-align: center; border-radius: 8px; margin-bottom: 15px;">
              <button onclick="window.print()" style="background: #1e3a8a; color: white; border: none; padding: 10px 30px; border-radius: 8px; cursor: pointer; font-weight: bold;">تأكيد طباعة النسختين</button>
          </div>
          <div class="page-wrapper">
              ${formHtml("نسخة الأرشيف")}
              <div class="cut-line"></div>
              ${formHtml("نسخة الموظف")}
          </div>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-[#1e3a8a]/40 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-auto">
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div>
            <h3 className="text-xl font-black text-[#1e3a8a]">تفاصيل طلب الإجازة الرقمي</h3>
            <p className="text-xs text-gray-400 font-bold mt-1">الرقم المرجعي: <span className="font-mono text-blue-500">{request.id}</span></p>
          </div>
          <div className="flex gap-2">
             <nav className="flex bg-white p-1 rounded-xl border shadow-sm">
                <button 
                  onClick={() => setView('doc')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'doc' ? 'bg-[#1e3a8a] text-white' : 'text-gray-400 hover:text-[#1e3a8a]'}`}
                >بيانات النموذج</button>
                <button 
                  onClick={() => setView('workflow')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'workflow' ? 'bg-[#1e3a8a] text-white' : 'text-gray-400 hover:text-[#1e3a8a]'}`}
                >دورة الاعتماد</button>
             </nav>
             <button onClick={onClose} className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors mr-2">
                <i className="fas fa-times text-2xl"></i>
             </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-10">
          {view === 'doc' ? (
            <div className="space-y-8">
              {/* بيانات منشئ المعاملة والبريد */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm shadow-sm">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div>
                    <span className="text-xs font-black text-amber-900 block">حساب Google المنشئ للطلب (مقدم المعاملة):</span>
                    <span className="font-mono text-xs font-bold text-blue-950" dir="ltr">{request.submitterEmail || 'غير مسجل'}</span>
                  </div>
                </div>
                {request.annualBalance !== undefined && (
                  <div className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-black text-amber-900">
                    رصيد الشيت السنوي: <span className="font-mono text-blue-700">{request.annualBalance}</span> يوم
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase block mb-2 tracking-widest">Employee Details</span>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">اسم الموظف:</span> <span className="font-bold text-[#1e3a8a]">{request.employeeName}</span></div>
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">كود الموظف:</span> <span className="font-bold text-gray-700">{request.employeeCode}</span></div>
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">القسم:</span> <span className="font-bold text-gray-700">{request.department}</span></div>
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">المسمى الوظيفي:</span> <span className="font-bold text-gray-700">{request.jobTitle}</span></div>
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">بريد الموظف:</span> <span className="font-mono text-xs font-bold text-gray-700" dir="ltr">{request.employeeEmail}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500 text-sm">تحريراً في:</span> <span className="font-bold text-blue-600">{request.displayIssueDate}</span></div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase block mb-2 tracking-widest">Leave Details</span>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">نوع الإجازة:</span> <span className="font-bold text-yellow-600">{request.leaveType}</span></div>
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">مدة الإجازة:</span> <span className="font-bold text-gray-700">{request.daysCount} أيام</span></div>
                    <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">تاريخ البداية:</span> <span className="font-bold text-gray-700">{request.startDate}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500 text-sm">تاريخ العودة:</span> <span className="font-bold text-green-700">{request.endDate}</span></div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-blue-50/50 rounded-2xl border-2 border-blue-100">
                <span className="text-[10px] font-black text-blue-400 uppercase block mb-2 tracking-widest">Additional Notes</span>
                <p className="text-gray-700 leading-relaxed italic">"{request.reason || 'لم يتم إدراج ملاحظات إضافية لهذا الطلب'}"</p>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
               <div className="flex flex-col items-center gap-6">
                  <div className="flex items-center gap-4 w-full max-w-md">
                     <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                     <div className="flex-1 p-4 bg-green-50 rounded-xl border border-green-100 text-right">
                        <div className="text-xs font-black text-green-700">تم تقديم الطلب</div>
                        <div className="text-[11px] text-green-800 font-bold">للموظف: {request.employeeName}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5" dir="ltr">منشئ الطلب: {request.submitterEmail || 'Google Account'}</div>
                     </div>
                  </div>
                  <div className="w-0.5 h-8 bg-gray-200"></div>
                  <div className="flex items-center gap-4 w-full max-w-md">
                     <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                     <div className="flex-1 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-right">
                        <div className="text-xs font-black text-yellow-700">انتظار موافقة المدير المباشر</div>
                        <div className="text-[10px] text-yellow-600 font-mono" dir="ltr">الإيميل: {LOCAL_CONFIG_EMAILS.DEPARTMENTS[request.department] || 'مدير القسم'}</div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
        
        <div className="p-8 bg-gray-50 border-t flex justify-end gap-4">
           <button onClick={onClose} className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all">إغلاق</button>
           <button onClick={generateISOPrint} className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-bold shadow-lg hover:bg-blue-900 transition-all flex items-center gap-2">
              <i className="fas fa-print"></i> طباعة النسختين
           </button>
        </div>
      </div>
    </div>
  );
};
