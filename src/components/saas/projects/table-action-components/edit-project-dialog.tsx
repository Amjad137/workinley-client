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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateProject } from '@/hooks/use-projects';
import { IProject } from '@/dto/project.dto';
import { PROJECT_STATUS } from '@/constants/project.constants';
import { getErrorMessage } from '@/utils/error-handler';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2, Pencil } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from '@/hooks/use-toast';

const schema = yup.object({
  name: yup.string().required('Required').min(2).max(100),
  code: yup
    .string()
    .required('Required')
    .matches(/^[A-Z0-9]{2,6}$/, '2-6 uppercase letters/digits'),
  description: yup.string().optional().max(500),
  color: yup.string().optional(),
  status: yup.string().oneOf(Object.values(PROJECT_STATUS)).optional(),
});

type FormValues = yup.InferType<typeof schema>;

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  project: IProject;
};

const EditProjectDialog = ({ open, setOpen, project }: Props) => {
  const { mutateAsync: update, isPending } = useUpdateProject();

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: project.name,
      code: project.code,
      description: project.description ?? '',
      color: project.color,
      status: project.status,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: project.name,
        code: project.code,
        description: project.description ?? '',
        color: project.color,
        status: project.status,
      });
    }
  }, [open, project, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await update({ id: project.id, data: values });
      setOpen(false);
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
            <Pencil size={18} /> Edit Project
          </DialogTitle>
          <DialogDescription>Update project details</DialogDescription>
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
                    <Input {...field} />
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
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PROJECT_STATUS.ACTIVE}>Active</SelectItem>
                      <SelectItem value={PROJECT_STATUS.ARCHIVED}>Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
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
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
