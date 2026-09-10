'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { USER_ROLE } from '@/constants/user.constants';
import { useCreateUserInvitation } from '@/hooks/use-user-invitations';
import { toast } from '@/hooks/use-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2, Mail, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { InferType, object, string } from 'yup';

const createInvitationSchema = object({
  email: string().email('Please enter a valid email address').required('Email is required'),
  role: string()
    .oneOf(Object.values(USER_ROLE), 'Please select a valid role')
    .required('Role is required'),
});

type CreateInvitationFormValues = InferType<typeof createInvitationSchema>;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CreateInvitationDialog = ({ open, setOpen }: Props) => {
  const { mutateAsync: createInvitation, isPending } = useCreateUserInvitation();

  const form = useForm<CreateInvitationFormValues>({
    resolver: yupResolver(createInvitationSchema),
    defaultValues: {
      email: '',
      role: USER_ROLE.USER,
    },
  });

  const onSubmit = async (values: CreateInvitationFormValues) => {
    const result = await createInvitation({
      email: values.email.trim().toLowerCase(),
      role: values.role as USER_ROLE,
    });

    // Try copying link to clipboard for admin convenience
    const inviteUrl =
      result.inviteLink ||
      `${window.location.origin}/auth/sign-up?invitation_code=${result.invitationCode}`;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast({
        title: 'Invite Link Copied',
        description: `Invitation link copied to clipboard for ${result.email}`,
      });
    } catch {
      // Ignore clipboard failure in restricted browser context
    }

    form.reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!isPending) {
          if (!val) form.reset();
          setOpen(val);
        }
      }}
    >
      <DialogContent className='sm:max-w-[480px]'>
        <DialogHeader>
          <DialogTitle className='text-xl flex items-center gap-2'>
            <Mail className='h-5 w-5 text-primary' />
            Invite New User
          </DialogTitle>
          <DialogDescription>
            Send an onboarding invitation link. The invited user will register with their designated
            role.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-2'>
            {/* Email field */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g. colleague@company.com'
                      type='email'
                      autoComplete='off'
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role selection */}
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required className='flex items-center gap-1.5'>
                    <Shield className='h-4 w-4 text-muted-foreground' />
                    Assigned Role
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={USER_ROLE.USER}>
                        <div className='flex flex-col text-left py-0.5'>
                          <span className='font-medium text-foreground'>Team Member (User)</span>
                          <span className='text-xs text-muted-foreground'>
                            Can submit and view their own reports
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value={USER_ROLE.MANAGER}>
                        <div className='flex flex-col text-left py-0.5'>
                          <span className='font-medium text-foreground'>Manager</span>
                          <span className='text-xs text-muted-foreground'>
                            Can review reports, manage team members, and view analytics
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value={USER_ROLE.ADMIN}>
                        <div className='flex flex-col text-left py-0.5'>
                          <span className='font-medium text-foreground'>Admin</span>
                          <span className='text-xs text-muted-foreground'>
                            Full platform control including user management and system settings
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='pt-4 gap-2 sm:gap-0'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Generate Invitation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvitationDialog;
