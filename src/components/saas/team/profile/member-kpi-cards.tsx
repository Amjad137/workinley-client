import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck2, FileText, ListTodo, RotateCcw } from 'lucide-react';

interface MemberKpiCardsProps {
  totalReports: number;
  totalTasks: number;
  approvedCount: number;
  pendingReviewCount: number;
  avgRevisions: number;
}

const MemberKpiCards = ({
  totalReports,
  totalTasks,
  approvedCount,
  pendingReviewCount,
  avgRevisions,
}: MemberKpiCardsProps) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            Reports Logged
          </CardTitle>
          <FileText size={18} className='text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold'>{totalReports}</div>
          <p className='text-xs text-muted-foreground mt-1'>Last 12 weeks period</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            Tasks Completed
          </CardTitle>
          <ListTodo size={18} className='text-primary' />
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold text-primary'>{totalTasks}</div>
          <p className='text-xs text-muted-foreground mt-1'>Across all weekly reports</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            Approved Reports
          </CardTitle>
          <FileCheck2 size={18} className='text-green-500' />
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold text-green-500'>{approvedCount}</div>
          <p className='text-xs text-muted-foreground mt-1'>{pendingReviewCount} pending review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            Avg. Revisions
          </CardTitle>
          <RotateCcw size={18} className='text-orange-400' />
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold text-orange-400'>{avgRevisions}x</div>
          <p className='text-xs text-muted-foreground mt-1'>Versions per submitted report</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberKpiCards;
