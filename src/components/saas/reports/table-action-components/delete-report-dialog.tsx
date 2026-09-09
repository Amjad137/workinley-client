'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteReport } from '@/hooks/use-reports';
import { AlertCircle } from 'lucide-react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  reportId: string;
  weekLabel: string;
};

const DeleteReportDialog = ({ open, setOpen, reportId, weekLabel }: Props) => {
  const { mutateAsync: deleteReport, isPending } = useDeleteReport();

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className='overflow-auto max-h-full'>
        <DialogTitle>
          <div className='flex flex-col items-center justify-center space-y-2'>
            <AlertCircle className='text-yellow-400' size={40} />
            <h2 className='text-xl font-semibold text-foreground'>Are you Sure!</h2>
          </div>
        </DialogTitle>

        <div className='flex flex-col items-center justify-center gap-10'>
          <div className='text-center font-semibold text-foreground'>
            Do you want to delete this draft report?
            <br />
            <ul className='text-start list-disc pl-5 mt-2'>
              <li>{weekLabel}</li>
            </ul>
          </div>

          <div className='flex flex-row gap-5'>
            <Button onClick={() => setOpen(false)} className='w-[160px]' variant='outline'>
              No
            </Button>
            <Button
              onClick={() => deleteReport(reportId).then(() => setOpen(false))}
              className='w-[160px]'
              loading={isPending}
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteReportDialog;
