import { REPORT_STATUS } from '@/constants/report.constants';

interface MemberStatusBreakdownProps {
  statusCounts: Record<string, number>;
}

const MemberStatusBreakdown = ({ statusCounts }: MemberStatusBreakdownProps) => {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
      <div className='p-3 rounded-lg border bg-green-500/10 border-green-200 dark:border-green-800 text-center'>
        <div className='text-xl font-bold text-green-600'>
          {statusCounts[REPORT_STATUS.APPROVED] ?? 0}
        </div>
        <div className='text-xs text-green-700 dark:text-green-400 mt-0.5'>Approved</div>
      </div>

      <div className='p-3 rounded-lg border bg-blue-500/10 border-blue-200 dark:border-blue-800 text-center'>
        <div className='text-xl font-bold text-blue-600'>
          {statusCounts[REPORT_STATUS.SUBMITTED] ?? 0}
        </div>
        <div className='text-xs text-blue-700 dark:text-blue-400 mt-0.5'>In Review</div>
      </div>

      <div className='p-3 rounded-lg border bg-orange-500/10 border-orange-200 dark:border-orange-800 text-center'>
        <div className='text-xl font-bold text-orange-600'>
          {statusCounts[REPORT_STATUS.NEEDS_CORRECTION] ?? 0}
        </div>
        <div className='text-xs text-orange-700 dark:text-orange-400 mt-0.5'>Needs Revision</div>
      </div>

      <div className='p-3 rounded-lg border bg-secondary border-border text-center'>
        <div className='text-xl font-bold text-muted-foreground'>
          {statusCounts[REPORT_STATUS.DRAFT] ?? 0}
        </div>
        <div className='text-xs text-muted-foreground mt-0.5'>Drafts</div>
      </div>
    </div>
  );
};

export default MemberStatusBreakdown;
