import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IWeeklyReport } from '@/dto/report.dto';
import { REPORT_STATUS } from '@/constants/report.constants';
import { Eye, MoreVertical, Pencil, Send, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ReportSheet from '../report-sheet';
import SubmitReportDialog from './submit-report-dialog';
import DeleteReportDialog from './delete-report-dialog';
import ReportDetailDialog from './report-detail-dialog';

type Props = {
  rowData: IWeeklyReport;
};

const ReportActionsDropdown = ({ rowData }: Props) => {
  const [openEditSheet, setOpenEditSheet] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const weekLabel = `W${rowData.weekNumber}/${rowData.year}`;
  const isDraft = rowData.status === REPORT_STATUS.DRAFT;
  const isNeedsCorrection = rowData.status === REPORT_STATUS.NEEDS_CORRECTION;
  const canEdit = isDraft || isNeedsCorrection;
  const canSubmit = canEdit;
  const canDelete = isDraft;

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
            <Eye className='mr-2 h-4 w-4' /> View Details
          </DropdownMenuItem>
          {canEdit && (
            <DropdownMenuItem onClick={() => openAction(setOpenEditSheet)}>
              <Pencil className='mr-2 h-4 w-4' /> Edit
            </DropdownMenuItem>
          )}
          {canSubmit && (
            <DropdownMenuItem onClick={() => openAction(setOpenSubmitDialog)}>
              <Send className='mr-2 h-4 w-4' /> Submit for Review
            </DropdownMenuItem>
          )}
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openAction(setOpenDeleteDialog)}
                className='text-destructive'
              >
                <Trash2 className='mr-2 h-4 w-4' /> Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {openEditSheet && (
        <ReportSheet open={openEditSheet} setOpen={setOpenEditSheet} report={rowData} />
      )}

      {openSubmitDialog && (
        <SubmitReportDialog
          open={openSubmitDialog}
          setOpen={setOpenSubmitDialog}
          reportId={rowData.id}
          weekLabel={weekLabel}
        />
      )}

      {openDeleteDialog && (
        <DeleteReportDialog
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          reportId={rowData.id}
          weekLabel={weekLabel}
        />
      )}

      {openDetailDialog && (
        <ReportDetailDialog
          open={openDetailDialog}
          setOpen={setOpenDetailDialog}
          report={rowData}
        />
      )}
    </>
  );
};

export default ReportActionsDropdown;
