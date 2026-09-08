
import React from 'react';
import { RequestStatus } from '../types';

interface StatusBadgeProps {
  status: RequestStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isApproved = 
    status === RequestStatus.APPROVED || 
    status === 'APPROVED' || 
    status === 'APPROVED&FILED' || 
    status === 'معتمد نهائياً';

  const isRejected = 
    status === RequestStatus.REJECTED || 
    status === 'REJECTED' || 
    status === 'مرفوض';

  const getStyles = () => {
    if (isApproved) {
      return "bg-green-100 text-green-700 border-green-200";
    }
    if (isRejected) {
      return "bg-red-100 text-red-700 border-red-200";
    }
    switch (status) {
      case RequestStatus.PENDING_MANAGER:
      case RequestStatus.PENDING_DEPT_HEAD:
      case RequestStatus.PENDING_HR:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getIcon = () => {
    if (isApproved) return "fa-check-circle";
    if (isRejected) return "fa-times-circle";
    return "fa-clock";
  };

  const displayText = isApproved ? 'APPROVED' : status;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStyles()}`}>
      <i className={`fas ${getIcon()}`}></i>
      {displayText}
    </span>
  );
};
