
export enum LeaveType {
  ANNUAL = 'اعتيادية',
  EMERGENCY = 'عارضة',
  UNPAID = 'بدون رصيد',
  REST = 'راحة',
  SICK = 'مرضي'
}

export enum RequestStatus {
  PENDING_MANAGER = 'في انتظار المدير المباشر',
  PENDING_DEPT_HEAD = 'في انتظار مدير الإدارة',
  PENDING_HR = 'في انتظار الموارد البشرية',
  APPROVED = 'APPROVED&FILED',
  REJECTED = 'مرفوض'
}

export interface Employee {
  code: string;
  name: string;
  dept: string;
  title: string;
  annualBalance?: number;
}

export interface LeaveRequest {
  id?: string;
  employeeName: string;
  employeeCode: string;
  jobTitle: string;
  employeeEmail: string;
  submitterEmail?: string; // البريد الإلكتروني لمنشئ الطلب (حساب الجيميل المفتوح)
  annualBalance?: number;  // الرصيد السنوي المسحوب من الشيت
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: RequestStatus;
  createdAt: string;
  displayIssueDate?: string;
  signatures: {
    employee?: string;
    manager?: string;
    deptHead?: string;
    hr?: string;
  };
}
