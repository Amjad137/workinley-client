'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProject } from '@/hooks/use-projects';
import { getErrorMessage } from '@/utils/error-handler';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2, FolderPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from '@/hooks/use-toast';

const schema = yup.object({
  name: yup.string().required('Project name is required').min(2).max(100),
  code: yup
    .string()
    .required('Project code is required')
    .matches(/^[A-Z0-9]{2,6}$/, 'Code must be 2-6 uppercase letters/digits'),
  description: yup.string().optional().max(500),
  color: yup.string().optional(),
});

type FormValues = yup.InferType<typeof schema>;

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CreateProjectDialog = ({ open, setOpen }: Props) => {
  const { mutateAsync: create, isPending } = useCreateProject();

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', code: '', description: '', color: '#3B82F6' },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await create(values);
      setOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: 'Error!',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className='max-w-md overflow-auto max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <FolderPlus size={18} /> Create Project
          </DialogTitle>
          <DialogDescription>Add a new project or work category</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. Client Alpha Portal' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-3'>
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Code *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='CAP'
                        className='uppercase'
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='color'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <input
                        type='color'
                        className='h-10 w-16 rounded-md border border-input cursor-pointer'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Brief description of the project...'
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-3 pt-2'>
              <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
