'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSubmitReport } from '@/hooks/use-reports';
import { Send, Loader2 } from 'lucide-react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  reportId: string;
  weekLabel: string;
};

const SubmitReportDialog = ({ open, setOpen, reportId, weekLabel }: Props) => {
  const { mutateAsync: submit, isPending } = useSubmitReport();

  const handleSubmit = async () => {
    await submit(reportId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <div className='flex justify-center mb-2'>
            <Send size={40} className='text-primary' />
          </div>
          <DialogTitle className='text-center'>Submit Report?</DialogTitle>
          <DialogDescription className='text-center'>
            Submit your report for <strong>{weekLabel}</strong> for manager review.
            <br />
            <span className='text-xs text-muted-foreground mt-1 block'>
              You can only edit it again if the manager requests changes.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className='flex justify-center gap-4 pt-2'>
          <Button variant='outline' onClick={() => setOpen(false)} className='w-28'>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending} className='w-28'>
            {isPending ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Submit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitReportDialog;
