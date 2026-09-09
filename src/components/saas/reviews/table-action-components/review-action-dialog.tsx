'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApproveReport, useRequestChanges } from '@/hooks/use-reports';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  reportId: string;
  weekLabel: string;
  memberName: string;
  mode: 'approve' | 'request_changes';
};

const ReviewActionDialog = ({ open, setOpen, reportId, weekLabel, memberName, mode }: Props) => {
  const [comment, setComment] = useState('');
  const { mutateAsync: approve, isPending: isApproving } = useApproveReport();
  const { mutateAsync: requestChanges, isPending: isRequesting } = useRequestChanges();

  const isApprove = mode === 'approve';
  const isPending = isApproving || isRequesting;

  const handleSubmit = async () => {
    if (!isApprove && !comment.trim()) return;
    if (isApprove) {
      await approve({ id: reportId, comment: comment || undefined });
    } else {
      await requestChanges({ id: reportId, comment });
    }
    setOpen(false);
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <div className='flex justify-center mb-2'>
            {isApprove ? (
              <CheckCircle2 size={40} className='text-green-500' />
            ) : (
              <XCircle size={40} className='text-orange-400' />
            )}
          </div>
          <DialogTitle className='text-center'>
            {isApprove ? 'Approve Report' : 'Request Changes'}
          </DialogTitle>
          <DialogDescription className='text-center'>
            {memberName} - {weekLabel}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-3'>
          <Textarea
            placeholder={
              isApprove
                ? 'Optional: leave a comment for the team member...'
                : 'Required: describe what needs to be changed...'
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
          {!isApprove && !comment.trim() && (
            <p className='text-xs text-destructive'>
              A comment is required when requesting changes.
            </p>
          )}
        </div>

        <div className='flex justify-end gap-3 pt-2'>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || (!isApprove && !comment.trim())}
            variant={isApprove ? 'default' : 'destructive'}
          >
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isApprove ? 'Approve' : 'Send Back'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewActionDialog;
