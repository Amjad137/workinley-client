'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useDeleteProject } from '@/hooks/use-projects';
import { AlertCircle } from 'lucide-react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  projectName: string;
  projectId: string;
};

const DeleteProjectDialog = ({ open, setOpen, projectName, projectId }: Props) => {
  const { mutateAsync: deleteProjectById, isPending } = useDeleteProject();

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
            Do you want to permanently delete this project?
            <br />
            <ul className='text-start list-disc pl-5 mt-2'>
              <li>{projectName}</li>
            </ul>
          </div>

          <div className='flex flex-row gap-5'>
            <Button onClick={() => setOpen(false)} className='w-[160px]' variant='outline'>
              No
            </Button>
            <Button
              onClick={() => deleteProjectById(projectId).then(() => setOpen(false))}
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

export default DeleteProjectDialog;
