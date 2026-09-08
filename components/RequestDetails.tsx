
import React, { useState } from 'react';
import { LeaveRequest, RequestStatus } from '../types';

interface RequestDetailsProps {
  request: LeaveRequest;
  onClose: () => void;
}

const LOCAL_CONFIG_EMAILS: any = {
  DEPARTMENTS: {
    "التخطيط و المتابعة": "ahmed.hamdan@dakahlia.net",
    "إدارة المخازن": "ahmed.hamdan@dakahlia.net",
    "الخامات": "raw.store.mgr@dakahlia.net",
    "المنتج التام": "finished.store@dakahlia.net",
    "قطع الغيار": "spareparts.store@dakahlia.net",
    "المخازن العامة": "general.store@dakahlia.net",
    "حركة المعدات": "equipment.mgr@dakahlia.net"
  },
  WAREHOUSE_DIRECTOR_MANAGER: "abdelhady.saleh@dakahlia.net",
  DEPT_HEAD: "ahmed.hamdan@dakahlia.net",
  HR: "sadat.planning.officer@dakahlia.net"
};

export const RequestDetails: React.FC<RequestDetailsProps> = ({ request, onClose }) => {
  const [view, setView] = useState<'doc' | 'workflow'>('doc');

  const isAhmedHamdan = 
    request.employeeEmail?.toLowerCase() === 'ahmed.hamdan@dakahlia.net' ||
    request.employeeCode === '70335' ||
    request.employeeName?.includes('حمدان') ||
    request.submitterEmail?.toLowerCase() === 'ahmed.hamdan@dakahlia.net';

  const directManagerEmail = isAhmedHamdan 
    ? LOCAL_CONFIG_EMAILS.WAREHOUSE_DIRECTOR_MANAGER 
    : (LOCAL_CONFIG_EMAILS.DEPARTMENTS[request.department] || 'مدير القسم');

  const deptHeadEmail = isAhmedHamdan 
    ? LOCAL_CONFIG_EMAILS.WAREHOUSE_DIRECTOR_MANAGER 
    : LOCAL_CONFIG_EMAILS.DEPT_HEAD;

  const generateISOPrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const issueDateStr = request.displayIssueDate || new Date().toLocaleDateString('ar-EG');

    const formHtml = () => `
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
                                       <td class="title-box">طلب تصريح أجازة</td>
                        <td class="logo-box">
                         <img src="data:image/jpeg;base64,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" />
                        </td>
                    </tr>
                </table>

          <div class="types-container">
              <span class="type-item">أعتيادية <span class="check-box">${request.leaveType === 'اعتيادية' ? '✔' : ''}</span></span>
              <span class="type-item">عارضة <span class="check-box">${request.leaveType === 'عارضة' ? '✔' : ''}</span></span>
              <span class="type-item">بدون رصيد <span class="check-box">${request.leaveType === 'بدون رصيد' ? '✔' : ''}</span></span>
              <span class="type-item">راحة <span class="check-box">${request.leaveType === 'راحة' ? '✔' : ''}</span></span>
              <span class="type-item">مرضي <span class="check-box">${request.leaveType === 'مرضي' ? '✔' : ''}</span></span>
          </div>
          <table class="content-table">
              <tr>
                  <td style="width: 55%;"><span class="label">تحريراً في:</span> <span class="value">${issueDateStr}</span></td>
                  <td><span class="label">كود الموظف:</span> <span class="value">${request.employeeCode}</span></td>
              </tr>
              <tr>
                  <td><span class="label">أسم الموظف:</span> <span class="value">${request.employeeName}</span></td>
                  <td><span class="label">الوظيفة:</span> <span class="value">${request.jobTitle || 'مسؤول تخطيط ومراقبة المخزون'}</span></td>
              </tr>
              <tr>
                  <td><span class="label">الإدارة:</span> <span class="value">المخازن</span></td>
                  <td><span class="label">القسم:</span> <span class="value">${request.department}</span></td>
              </tr>
              <tr>
                  <td><span class="label">عدد الأيام:</span> <span class="value">${request.daysCount} يوم</span></td>
                  <td><span class="label">من</span> <span class="value">${request.startDate}</span> <span class="label">إلى</span> <span class="value">${request.endDate}</span></td>
              </tr>
          </table>
          <div class="notes-row">
              <span class="label">ملاحظات:</span> <span class="value">${request.reason || '..................................................................................'}</span>
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
                    <span class="approver-email">${directManagerEmail}</span>
                  </td>
                  <td>
                    مدير الإدارة<span class="sig-underline"></span>
                    <div class="stamp-text" style="color: #166534; border-color: #166534;">APPROVED</div>
                    <span class="approver-email">${deptHeadEmail}</span>
                  </td>
                  <td>
                    الموارد البشرية<span class="sig-underline"></span>
                    <div class="stamp-text" style="color: #1e40af; border-color: #1e40af;">REVIEWED</div>
                    <span class="approver-email">${LOCAL_CONFIG_EMAILS.HR}</span>
                  </td>
              </tr>
          </table>
          <div class="footer">الدقهلية للدواجن (مصنع أعلاف السادات) - إدارة الموارد البشرية</div>
      </div>
    `;

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
          <meta charset="UTF-8">
          <title>طباعة نموذج إجازة - ${request.employeeName} (${request.id})</title>
          <style>
              @page { size: A4 portrait; margin: 15mm 12mm; }
              body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; color: #000; background: #fff; line-height: 1.4; }
              .page-wrapper { width: 100%; box-sizing: border-box; }
              .form-container { border: 2.5px solid #000; width: 100%; box-sizing: border-box; }
              .header-table { width: 100%; border-collapse: collapse; border-bottom: 2.5px solid #000; table-layout: fixed; }
              .header-table td { border-left: 2px solid #000; padding: 8px 6px; vertical-align: middle; text-align: center; }
              .header-table td:last-child { border-left: none; }
              .logo-box { width: 35%; text-align: left; padding: 6px 14px !important; }
              .logo-img { height: 42px; vertical-align: middle; }
              .company-name { font-weight: bold; font-size: 11pt; margin-left: 10px; }
              .title-box { font-size: 16pt; font-weight: bold; color: #1e3a8a; }
              .meta-inner-table { width: 100%; border-collapse: collapse; font-size: 8pt; }
              .meta-inner-table td { border: none; padding: 2px 6px; text-align: right; }
              .meta-inner-table td:first-child { text-align: left; font-weight: normal; color: #555; }
              .types-container { padding: 8px 10px; border-bottom: 2px solid #000; text-align: center; background: #f8fafc; font-size: 9.5pt; }
              .type-item { display: inline-block; margin: 0 10px; font-weight: bold; }
              .check-box { display: inline-block; width: 16px; height: 16px; border: 1.5px solid #000; vertical-align: middle; margin-right: 4px; text-align: center; line-height: 15px; font-size: 11pt; background: #fff; }
              .content-table { width: 100%; border-collapse: collapse; }
              .content-table td { padding: 8px 16px; border-bottom: 1px solid rgba(0,0,0,0.08); font-size: 10.5pt; height: 32px; }
              .label { font-weight: bold; margin-left: 6px; color: #111; }
              .value { color: #1e3a8a; font-weight: bold; font-family: 'Courier New', monospace; font-size: 11pt; }
              .notes-row { width: 100%; border-bottom: 2px solid #000; padding: 10px 16px; min-height: 45px; font-size: 10.5pt; box-sizing: border-box; }
              .sig-table { width: 100%; border-collapse: collapse; }
              .sig-table td { width: 25%; text-align: center; font-weight: bold; padding: 12px 6px 35px 6px; border-left: none; vertical-align: top; font-size: 10pt; }
              .sig-underline { display: block; margin-top: 22px; border-top: 1px dashed #000; width: 75%; margin: 6px auto; }
              .stamp-text { font-size: 8pt; font-weight: bold; font-family: monospace; border: 1.5px solid #cbd5e1; padding: 3px 6px; display: inline-block; margin-top: 4px; border-radius: 4px; }
              .approver-email { font-size: 7.5pt; font-family: monospace; color: #475569; margin-top: 4px; display: block; font-weight: bold; overflow-wrap: break-word; line-height: 1.2; }
              .footer { text-align: center; padding: 8px; font-size: 8pt; font-weight: bold; border-top: 1.5px solid #000; color: #475569; background: #f8fafc; }
              @media print { .no-print { display: none; } }
          </style>
      </head>
      <body>
          <div class="no-print" style="background: #f1f5f9; padding: 12px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
              <button onclick="window.print()" style="background: #1e3a8a; color: white; border: none; padding: 10px 32px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px;">🖨️ تأكيد طباعة النموذج</button>
          </div>
          <div class="page-wrapper">
              ${formHtml()}
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
               {isAhmedHamdan && (
                 <div className="mb-6 mx-auto max-w-md p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-right text-xs text-amber-900 font-bold flex items-center gap-2.5">
                   <i className="fas fa-star text-amber-500 text-sm"></i>
                   <span>استثناء إداري لمدير المخازن (أ/ أحمد حمدان): المدير المباشر المعتمد عليه هو أ/ عبد الهادي صالح (abdelhady.saleh@dakahlia.net).</span>
                 </div>
               )}
               <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4 w-full max-w-md">
                     <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                     <div className="flex-1 p-4 bg-green-50 rounded-xl border border-green-100 text-right">
                        <div className="text-xs font-black text-green-700">تم تقديم الطلب</div>
                        <div className="text-[11px] text-green-800 font-bold">للموظف: {request.employeeName}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5" dir="ltr">منشئ الطلب: {request.submitterEmail || 'Google Account'}</div>
                     </div>
                  </div>
                  <div className="w-0.5 h-6 bg-gray-200"></div>
                  <div className="flex items-center gap-4 w-full max-w-md">
                     <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                     <div className="flex-1 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-right">
                        <div className="text-xs font-black text-yellow-700">{isAhmedHamdan ? 'اعتماد المشرف العام / المدير المباشر' : 'موافقة المدير المباشر'}</div>
                        <div className="text-[11px] text-yellow-900 font-bold">{isAhmedHamdan ? 'أ/ عبد الهادي صالح' : (request.department || 'القسم')}</div>
                        <div className="text-[10px] text-yellow-700 font-mono mt-0.5" dir="ltr">{directManagerEmail}</div>
                     </div>
                  </div>
                  <div className="w-0.5 h-6 bg-gray-200"></div>
                  <div className="flex items-center gap-4 w-full max-w-md">
                     <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                     <div className="flex-1 p-4 bg-blue-50 rounded-xl border border-blue-100 text-right">
                        <div className="text-xs font-black text-blue-700">الاعتماد والتوثيق النهائي (HR)</div>
                        <div className="text-[11px] text-blue-900 font-bold">إدارة الموارد البشرية</div>
                        <div className="text-[10px] text-blue-700 font-mono mt-0.5" dir="ltr">{LOCAL_CONFIG_EMAILS.HR}</div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
        
        <div className="p-8 bg-gray-50 border-t flex justify-end gap-4">
           <button onClick={onClose} className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all">إغلاق</button>
           <button onClick={generateISOPrint} className="px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-bold shadow-lg hover:bg-blue-900 transition-all flex items-center gap-2">
              <i className="fas fa-print"></i> طباعة نموذج الإجازة
           </button>
        </div>
      </div>
    </div>
  );
};
