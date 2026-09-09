'use client';

import { useForm } from 'react-hook-form';

import { ROUTES } from '@/constants/routes.constants';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useSignIn } from '@/hooks/use-auth';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { InferType, object, string } from 'yup';
import { useRouter } from 'next/navigation';

const loginSchema = object({
  email: string().email('Invalid email format.').required('Email is required.'),
  password: string()
    .min(6, 'Password must be at least 6 characters.')
    .required('Password is required.'),
});

type FormValues = InferType<typeof loginSchema>;

export default function SignInPage() {
  const signInMutation = useSignIn();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signInFormOnSubmit = form.handleSubmit(async (values: FormValues) => {
    try {
      await signInMutation.mutateAsync(values);
      router.push(ROUTES.SAAS_ROOT);
    } catch {
      // Errors handled in the auth hook
    }
  });

  return (
    <Card className='min-w-[350px]'>
      <CardHeader className='p-3'>
        <CardTitle className='text-center text-xl font-bold'>Sign In</CardTitle>
      </CardHeader>

      <CardContent className='flex flex-col gap-5'>
        <Form {...form}>
          <form onSubmit={signInFormOnSubmit} className='flex flex-col gap-3 min-w-30'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Username' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Password' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className='text-sm text-right font-medium text-muted-foreground hover:underline underline-offset-2'
            >
              Forgot Password?
            </Link>
            <Button
              type='submit'
              loading={signInMutation.isPending}
              disabled={signInMutation.isPending}
            >
              Sign In
            </Button>
          </form>

          <h5 className='text-xs text-center'>
            Don&apos;t have an account?{' '}
            <Link className='underline' href={ROUTES.SIGN_UP}>
              Sign Up
            </Link>
          </h5>
        </Form>
      </CardContent>
    </Card>
  );
}
