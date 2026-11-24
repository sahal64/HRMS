import * as React from 'react';
import { cn } from '@/utils/cn';

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className,
}) => {
  const normalized = status.toLowerCase().replace(/[\s-]/g, '_');

  let colorClasses = 'bg-[#f0ede6] text-stone-700';

  switch (normalized) {
    case 'approved':
    case 'active':
    case 'completed':
    case 'present':
    case 'on_time':
      // Soft sage green pill (from Design 3)
      colorClasses = 'bg-[#e2f3e8] text-[#15803d]';
      break;

    case 'pending':
    case 'review':
    case 'in_progress':
      // Soft blush / rose pill (from Design 3)
      colorClasses = 'bg-[#ffe4e6] text-[#e11d48]';
      break;

    case 'rejected':
    case 'absent':
    case 'cancelled':
    case 'urgent':
      colorClasses = 'bg-[#fee2e2] text-[#dc2626]';
      break;

    case 'late':
    case 'late_present':
    case 'probation':
    case 'on_hold':
      // Warm amber / soft peach pill
      colorClasses = 'bg-[#fef3c7] text-[#b45309]';
      break;

    case 'draft':
    case 'inactive':
    case 'closed':
    default:
      colorClasses = 'bg-[#eeece6] text-stone-600';
      break;
  }

  const displayLabel = label || status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-normal select-none',
        colorClasses,
        className
      )}
    >
      {displayLabel}
    </span>
  );
};
