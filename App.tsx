
import React, { useState, useEffect } from 'react';
import { LeaveForm } from './components/LeaveForm';
import { StatusBadge } from './components/StatusBadge';
import { SetupGuide } from './components/SetupGuide';
import { RequestDetails } from './components/RequestDetails';
import { submitLeaveRequest } from './services/gasService';
import { LeaveRequest, RequestStatus } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'dashboard' | 'setup'>('form');
  const [submissions, setSubmissions] = useState<LeaveRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('leave_requests_warehouse');
    if (saved) setSubmissions(JSON.parse(saved));
  }, []);

  const saveSubmissions = (newSubs: LeaveRequest[]) => {
    setSubmissions(newSubs);
    localStorage.setItem('leave_requests_warehouse', JSON.stringify(newSubs));
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    setMessage(null);

    const requestId = 'FHR-W-' + Math.floor(100000 + Math.random() * 900000);
    const finalData = { ...data, requestId };

    const result = await submitLeaveRequest(finalData);

    if (result.success) {
      const newRequest: LeaveRequest = {
        ...data,
        id: requestId,
        status: RequestStatus.PENDING_MANAGER,
        createdAt: new Date().toISOString(),
        displayIssueDate: data.displayIssueDate,
        signatures: {}
      };
      
      const updatedList = [newRequest, ...submissions];
      saveSubmissions(updatedList);
      setIsSubmitting(false);
      setMessage({ 
        type: 'success', 
        text: `تم إرسال الطلب ${requestId} بنجاح! جاري توجيهه للمدير المباشر.` 
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
            <div className="flex items-center gap-3 mt-3">
              <span className="bg-blue-600 text-white text-[11px] px-3 py-1 rounded-full font-bold shadow-sm">FORM F-HR-601</span>
              <span className="text-gray-400 text-[11px] font-black border-r pr-3 border-gray-200">ISO 9001:2015 CERTIFIED SYSTEM</span>
            </div>
          </div>
        </div>
        
        <nav className="flex bg-gray-100/50 p-2 rounded-2xl border border-gray-200 shadow-sm">
          <button onClick={() => setActiveTab('form')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'form' ? 'bg-[#1e3a8a] text-white shadow-lg' : 'text-gray-500 hover:bg-white'}`}>طلب إجازة</button>
          <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#1e3a8a] text-white shadow-lg' : 'text-gray-500 hover:bg-white'}`}>سجل الطلبات</button>
          <button onClick={() => setActiveTab('setup')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'setup' ? 'bg-[#1e3a8a] text-white shadow-lg' : 'text-gray-500 hover:bg-white'}`}>الإعدادات</button>
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
          {activeTab === 'form' && <LeaveForm onSubmit={handleSubmit} isLoading={isSubmitting} />}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="border-r-4 border-yellow-500 pr-5">
                  <h2 className="text-2xl font-black text-gray-800">تتبع الطلبات</h2>
                </div>
              </div>
              
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                {submissions.length === 0 ? (
                  <div className="text-center py-20 text-gray-400 font-bold">لم ترسل أي طلبات بعد</div>
                ) : (
                  <table className="w-full text-right">
                    <thead className="bg-gray-50 text-xs font-black uppercase text-gray-400">
                      <tr>
                        <th className="py-4 px-6">الموظف</th>
                        <th className="py-4 px-6">النوع</th>
                        <th className="py-4 px-6">الحالة</th>
                        <th className="py-4 px-6 text-center">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {submissions.map((req) => (
                        <tr key={req.id} className="hover:bg-blue-50/50 transition-all">
                          <td className="py-4 px-6"><div className="font-bold">{req.employeeName}</div><div className="text-[10px] font-mono text-blue-500">{req.id}</div></td>
                          <td className="py-4 px-6 text-sm">{req.leaveType}</td>
                          <td className="py-4 px-6"><StatusBadge status={req.status} /></td>
                          <td className="py-4 px-6 text-center">
                            <button onClick={() => setSelectedRequest(req)} className="text-[#1e3a8a] text-xs font-black hover:underline">عرض التفاصيل</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
          {activeTab === 'setup' && <SetupGuide />}
        </div>
      </main>

      {selectedRequest && <RequestDetails request={selectedRequest} onClose={() => setSelectedRequest(null)} />}
    </div>
  );
};

export default App;
