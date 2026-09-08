
import React, { useState, useEffect, useCallback } from 'react';
import { LeaveForm } from './components/LeaveForm';
import { StatusBadge } from './components/StatusBadge';
import { SetupGuide } from './components/SetupGuide';
import { RequestDetails } from './components/RequestDetails';
import { AccountModal } from './components/AccountModal';
import { submitLeaveRequest, fetchEmployeesFromSheet, getInitialSubmitterEmail, setStoredSubmitterEmail, detectActiveGoogleUser } from './services/gasService';
import { LeaveRequest, RequestStatus, Employee } from './types';

const ADMIN_EMAIL = 'sadat.planning.officer@dakahlia.net';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'dashboard' | 'setup'>('form');
  const [submissions, setSubmissions] = useState<LeaveRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // حالة الموظفين والمزامنة من شيت Google
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isSyncingEmployees, setIsSyncingEmployees] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  // قراءة إيميل حساب Google النشط في المتصفح تلقائياً (مثل Google Forms)
  const initialEmail = getInitialSubmitterEmail();
  const [submitterEmail, setSubmitterEmail] = useState<string>(initialEmail);
  const [showAccountModal, setShowAccountModal] = useState<boolean>(!initialEmail);
  const [adminViewAll, setAdminViewAll] = useState(false);

  const isAdmin = submitterEmail.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const handleUpdateSubmitterEmail = (newEmail: string) => {
    const clean = newEmail.trim().toLowerCase();
    setSubmitterEmail(clean);
    setStoredSubmitterEmail(clean);
    setShowAccountModal(false);
  };

  const handleClearSubmitterEmail = () => {
    setSubmitterEmail('');
    setStoredSubmitterEmail('');
    setShowAccountModal(true);
  };

  const syncEmployees = useCallback(async () => {
    setIsSyncingEmployees(true);
    try {
      const res = await fetchEmployeesFromSheet();
      if (res.success && res.employees.length > 0) {
        setEmployees(res.employees);
        setLastSyncTime(new Date());
        if (res.activeUser && res.activeUser !== ADMIN_EMAIL && !submitterEmail) {
          setSubmitterEmail(res.activeUser);
          setStoredSubmitterEmail(res.activeUser);
        }
      }
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setIsSyncingEmployees(false);
    }
  }, [submitterEmail]);

  useEffect(() => {
    const saved = localStorage.getItem('leave_requests_warehouse');
    if (saved) {
      try {
        setSubmissions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse submissions', e);
      }
    }
    // كشف حساب Google المفتوح في المتصفح تلقائياً في الخلفية (مثل Google Forms)
    detectActiveGoogleUser().then(detected => {
      if (detected) {
        setSubmitterEmail(detected);
      }
    });

    // مزامنة الموظفين من الشيت عند بدء التطبيق
    syncEmployees();
  }, [syncEmployees]);

  const saveSubmissions = (newSubs: LeaveRequest[]) => {
    setSubmissions(newSubs);
    localStorage.setItem('leave_requests_warehouse', JSON.stringify(newSubs));
  };

  const handleSubmit = async (data: any) => {
    if (!submitterEmail || !submitterEmail.trim()) {
      setShowAccountModal(true);
      setMessage({ type: 'error', text: 'اختيار وتأكيد البريد الإلكتروني إجباري لمتابعة إرسال الطلب.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const requestId = 'FHR-W-' + Math.floor(100000 + Math.random() * 900000);
    const finalData = { ...data, requestId, submitterEmail: submitterEmail || '' };

    const result = await submitLeaveRequest(finalData);

    if (result.success) {
      const newRequest: LeaveRequest = {
        ...data,
        id: requestId,
        status: RequestStatus.PENDING_MANAGER,
        createdAt: new Date().toISOString(),
        displayIssueDate: data.displayIssueDate,
        submitterEmail: submitterEmail || 'مسجل بحساب Google في المتصفح',
        signatures: {}
      };
      
      const updatedList = [newRequest, ...submissions];
      saveSubmissions(updatedList);
      setIsSubmitting(false);
      setMessage({ 
        type: 'success', 
        text: `تم إرسال الطلب ${requestId} بنجاح! تم توثيق حساب Google وتوجيه الطلب للمدير المباشر.` 
      });
      setActiveTab('dashboard');
    } else {
      setIsSubmitting(false);
      setMessage({ 
        type: 'error', 
        text: result.error || 'فشل الاتصال بخادم جوجل. يرجى مراجعة إعدادات Apps Script.' 
      });
    }
  };

  // تصفية الطلبات: يظهر لكل إيميل فقط الطلبات التي أنشأها، ولا يرى طلبات الآخرين
  const userSubmissions = submissions.filter(req => {
    if (isAdmin && adminViewAll) return true;
    const reqEmail = (req.submitterEmail || '').trim().toLowerCase();
    const currentEmail = submitterEmail.trim().toLowerCase();
    return reqEmail === currentEmail;
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 font-['Tajawal'] text-right" dir="rtl">
      <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-8 rounded-3xl shadow-xl border border-blue-50">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 bg-white p-3 rounded-2xl shadow-inner border border-gray-100 flex items-center justify-center">
             <img src="https://i.ibb.co/LhyM4vC/dakahlia-logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#1e3a8a] mb-1">نظام طلبات الإجازات الإلكتروني</h1>
            <h2 className="text-xl font-bold text-yellow-600">شركة الدقهلية للدواجن - قطاع المخازن</h2>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="bg-blue-600 text-white text-[11px] px-3 py-1 rounded-full font-bold shadow-sm">FORM F-HR-601</span>
              <span className="text-gray-400 text-[11px] font-black border-r pr-3 border-gray-200">ISO 9001:2015 CERTIFIED SYSTEM</span>
              <span className="bg-green-100 text-green-800 text-[11px] px-3 py-1 rounded-full font-bold flex items-center gap-1 border border-green-200">
                <i className="fas fa-database text-[9px]"></i>
                متصل بشيت: تصريح اجازات (data)
              </span>
              {submitterEmail ? (
                <div className="bg-slate-100 text-slate-800 text-[11px] px-3.5 py-1.5 rounded-full font-bold flex items-center gap-2 border border-slate-200 shadow-sm font-mono" dir="ltr">
                  <i className="fab fa-google text-blue-600 text-xs"></i>
                  <span>{submitterEmail}</span>
                  <button
                    type="button"
                    onClick={() => setShowAccountModal(true)}
                    className="font-sans text-[10px] text-blue-700 hover:text-blue-900 underline font-black ml-1"
                    title="تبديل الحساب مثل Google Forms"
                  >
                    (تبديل)
                  </button>
                </div>
              ) : (
                <div className="bg-slate-100 text-slate-600 text-[11px] px-3.5 py-1.5 rounded-full font-bold flex items-center gap-2 border border-slate-200 shadow-sm">
                  <i className="fab fa-google text-blue-500 text-xs"></i>
                  <span>تسجيل بحساب Google</span>
                  <button
                    type="button"
                    onClick={() => setShowAccountModal(true)}
                    className="font-sans text-[10px] text-blue-700 hover:text-blue-900 underline font-black mr-1"
                  >
                    (تحديد أو تبديل)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <nav className="flex bg-gray-100/50 p-2 rounded-2xl border border-gray-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('form')} 
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'form' ? 'bg-[#1e3a8a] text-white shadow-lg' : 'text-gray-500 hover:bg-white'}`}
          >
            طلب إجازة
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#1e3a8a] text-white shadow-lg' : 'text-gray-500 hover:bg-white'}`}
          >
            سجل طلباتي ({userSubmissions.length})
          </button>
          {/* يظهر دليل الربط والشيت حصرياً لحساب sadat.planning.officer@dakahlia.net */}
          {isAdmin && (
            <button 
              onClick={() => setActiveTab('setup')} 
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'setup' ? 'bg-[#1e3a8a] text-white shadow-lg' : 'text-gray-500 hover:bg-white'}`}
            >
              دليل الربط والشيت
            </button>
          )}
        </nav>
      </header>

      {message && (
        <div className={`mb-8 p-5 rounded-2xl border-r-8 shadow-md flex justify-between items-center ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-500' : 'bg-red-50 text-red-800 border-red-500'}`}>
          <p className="font-bold">{message.text}</p>
          <button onClick={() => setMessage(null)}><i className="fas fa-times opacity-50"></i></button>
        </div>
      )}

      <main className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden min-h-[500px]">
        <div className="h-3 bg-gradient-to-l from-[#1e3a8a] to-blue-500"></div>
        <div className="p-8 md:p-12">
          {activeTab === 'form' && (
            <LeaveForm 
              employees={employees}
              isLoading={isSubmitting}
              isSyncing={isSyncingEmployees}
              onRefreshEmployees={syncEmployees}
              lastSyncTime={lastSyncTime}
              submitterEmail={submitterEmail}
              onOpenAccountModal={() => setShowAccountModal(true)}
              onAccountSelected={handleUpdateSubmitterEmail}
              onSubmit={handleSubmit} 
            />
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="border-r-4 border-yellow-500 pr-5">
                  <h2 className="text-2xl font-black text-gray-800">
                    {isAdmin && adminViewAll ? 'كافة طلبات القطاع (لوحة المسؤول)' : 'سجل طلباتي الخاصة'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    يتم عرض الطلبات التي تم إنشاؤها من حسابك فقط (<span className="font-mono font-bold text-blue-900" dir="ltr">{submitterEmail}</span>)
                  </p>
                </div>

                {/* صلاحية خاصة للمسؤول للتبديل بين طلباته الخاصة وكافة الطلبات */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setAdminViewAll(!adminViewAll)}
                    className="px-4 py-2 bg-blue-50 border border-blue-200 text-[#1e3a8a] rounded-xl text-xs font-bold hover:bg-blue-100 transition-all flex items-center gap-2 self-start"
                  >
                    <i className={`fas ${adminViewAll ? 'fa-user-check' : 'fa-users-cog'}`}></i>
                    <span>{adminViewAll ? 'عرض طلباتي فقط' : 'عرض كافة طلبات النظام (مشرف)'}</span>
                  </button>
                )}
              </div>
              
              <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                {userSubmissions.length === 0 ? (
                  <div className="text-center py-20 text-gray-400 font-bold">
                    <i className="fas fa-folder-open text-4xl block mb-3 text-gray-300"></i>
                    لم يتم العثور على أي طلبات مسجلة من هذا الحساب ({submitterEmail})
                  </div>
                ) : (
                  <table className="w-full text-right">
                    <thead className="bg-gray-50 text-xs font-black uppercase text-gray-400">
                      <tr>
                        <th className="py-4 px-6">الموظف</th>
                        <th className="py-4 px-6">مقدم الطلب (المنشئ)</th>
                        <th className="py-4 px-6">النوع والمدة</th>
                        <th className="py-4 px-6">الحالة</th>
                        <th className="py-4 px-6 text-center">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {userSubmissions.map((req) => (
                        <tr key={req.id} className="hover:bg-blue-50/50 transition-all">
                          <td className="py-4 px-6">
                            <div className="font-bold text-[#1e3a8a]">{req.employeeName}</div>
                            <div className="text-[11px] font-mono text-gray-500">كود: {req.employeeCode} | {req.department}</div>
                            <div className="text-[10px] font-mono text-blue-500">{req.id}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded inline-block" dir="ltr">
                              {req.submitterEmail || 'غير محدد'}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5">حساب منشئ المعاملة</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm font-bold">{req.leaveType}</div>
                            <div className="text-xs text-gray-500">{req.daysCount} أيام ({req.startDate})</div>
                          </td>
                          <td className="py-4 px-6"><StatusBadge status={req.status} /></td>
                          <td className="py-4 px-6 text-center">
                            <button onClick={() => setSelectedRequest(req)} className="text-[#1e3a8a] bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-black hover:bg-blue-100 transition-colors">
                              عرض التفاصيل
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
          {activeTab === 'setup' && isAdmin && <SetupGuide />}
        </div>
      </main>

      {selectedRequest && <RequestDetails request={selectedRequest} onClose={() => setSelectedRequest(null)} />}

      <AccountModal
        isOpen={showAccountModal}
        currentEmail={submitterEmail}
        employees={employees}
        canClose={Boolean(submitterEmail)}
        onClose={() => {
          if (submitterEmail) {
            setShowAccountModal(false);
          }
        }}
        onSave={handleUpdateSubmitterEmail}
        onClear={handleClearSubmitterEmail}
      />
    </div>
  );
};

export default App;
