import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IWeeklyReport } from '@/dto/report.dto';
import { REPORT_STATUS } from '@/constants/report.constants';
import { CheckCircle2, Eye, MoreVertical, XCircle } from 'lucide-react';
import { useState } from 'react';
import ReviewActionDialog from './review-action-dialog';
import ReportDetailDialog from '@/components/saas/reports/table-action-components/report-detail-dialog';

type Props = {
  rowData: IWeeklyReport;
};

const ReviewActionsDropdown = ({ rowData }: Props) => {
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const weekLabel = `W${rowData.weekNumber}/${rowData.year}`;
  const memberName = rowData.user?.name ?? 'Unknown';
  const isSubmitted = rowData.status === REPORT_STATUS.SUBMITTED;

  const openAction = (setter: (v: boolean) => void) => {
    setOpenDropdown(false);
    setter(true);
  };

  return (
    <>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger className='items-right w-full' asChild>
          <MoreVertical size={15} className='cursor-pointer' />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mr-7' align='start'>
          <DropdownMenuItem onClick={() => openAction(setOpenDetailDialog)}>
            <Eye className='mr-2 h-4 w-4' /> View Report
          </DropdownMenuItem>
          {isSubmitted && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openAction(setOpenApproveDialog)}
                className='text-green-600'
              >
                <CheckCircle2 className='mr-2 h-4 w-4' /> Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openAction(setOpenRequestDialog)}
                className='text-orange-500'
              >
                <XCircle className='mr-2 h-4 w-4' /> Request Changes
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {openDetailDialog && (
        <ReportDetailDialog
          open={openDetailDialog}
          setOpen={setOpenDetailDialog}
          report={rowData}
        />
      )}

      {openApproveDialog && (
        <ReviewActionDialog
          open={openApproveDialog}
          setOpen={setOpenApproveDialog}
          reportId={rowData.id}
          weekLabel={weekLabel}
          memberName={memberName}
          mode='approve'
        />
      )}

      {openRequestDialog && (
        <ReviewActionDialog
          open={openRequestDialog}
          setOpen={setOpenRequestDialog}
          reportId={rowData.id}
          weekLabel={weekLabel}
          memberName={memberName}
          mode='request_changes'
        />
      )}
    </>
  );
};

export default ReviewActionsDropdown;
