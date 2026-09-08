
import React from 'react';
import { RequestStatus } from '../types';

interface StatusBadgeProps {
  status: RequestStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case RequestStatus.APPROVED:
        return "bg-green-100 text-green-700 border-green-200";
      case RequestStatus.REJECTED:
        return "bg-red-100 text-red-700 border-red-200";
      case RequestStatus.PENDING_MANAGER:
      case RequestStatus.PENDING_DEPT_HEAD:
      case RequestStatus.PENDING_HR:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getIcon = () => {
    switch (status) {
      case RequestStatus.APPROVED: return "fa-check-circle";
      case RequestStatus.REJECTED: return "fa-times-circle";
      default: return "fa-clock";
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStyles()}`}>
      <i className={`fas ${getIcon()}`}></i>
      {status}
    </span>
  );
};
