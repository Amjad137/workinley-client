/* eslint-disable sonarjs/no-nested-conditional */
'use client';

import Link from 'next/link';
import { Suspense, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  getSignupSchema,
  ISignupFormValues,
} from '@/components/saas/auth/sign-up/schema/sign-up.schema';
import SignUpForm from '@/components/saas/auth/sign-up/sign-up-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes.constants';
import { S3_FOLDERS } from '@/constants/s3.constants';
import { USER_ROLE } from '@/constants/user.constants';
import { useSignUp } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { useValidateInvitation } from '@/hooks/use-user-invitations';
import { uploadPublicImage } from '@/services/upload.service';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertCircle, CheckCircle2, Loader2, Shield } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const SignupContent = () => {
  const signUpMutation = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();

  const invitationCode =
    searchParams?.get('invitation_code') ||
    searchParams?.get('invitationCode') ||
    searchParams?.get('code') ||
    null;

  const {
    isLoading: isValidating,
    data: validationData,
    isValid: isInvitationValid,
  } = useValidateInvitation(invitationCode ?? undefined, {
    enabled: !!invitationCode,
  });

  const form = useForm<ISignupFormValues>({
    resolver: yupResolver(getSignupSchema('create')),
    defaultValues: {
      name: '',
      address: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  });

  // When invitation code is successfully validated, lock email and prefill it
  useEffect(() => {
    if (isInvitationValid && validationData?.email) {
      form.setValue('email', validationData.email, { shouldValidate: true });
    }
  }, [isInvitationValid, validationData?.email, form]);

  const isSubmitting = form.formState.isSubmitting;

  const signUpFormOnSubmit = async (values: ISignupFormValues) => {
    let uploadedImageKey: string | undefined; // Track uploaded image for cleanup

    try {
      let profilePicUrl: string | undefined;

      // Upload profile picture first if provided
      if (values.profilePicture && values.profilePicture instanceof File) {
        try {
          const uploadResult = await uploadPublicImage(
            values.profilePicture,
            S3_FOLDERS.PROFILE_IMAGES,
          );

          profilePicUrl = uploadResult.url; // Use public URL instead of key
          uploadedImageKey = uploadResult.key; // Store key for potential cleanup
        } catch (uploadError) {
          console.error('Profile picture upload failed:', uploadError);
          toast({
            title: 'Profile Picture Upload Failed',
            description: 'Failed to upload profile picture. Continuing with signup...',
            variant: 'destructive',
          });
          // Continue with signup even if profile picture upload fails
        }
      }

      // Prepare signup data for better-auth
      const { name, phoneNumber, address, ...cleanValues } = values;

      await signUpMutation.mutateAsync({
        email: cleanValues.email,
        password: cleanValues.password ?? '',
        name,
        phoneNumber,
        address,
        image: profilePicUrl,
        ...(invitationCode && isInvitationValid ? { invitationCode } : {}),
      });

      router.push(ROUTES.SAAS_ROOT);
    } catch {
      // Clean up uploaded image if signup failed
      if (uploadedImageKey) {
        try {
          const { deleteS3Files } = await import('@/services/upload.service');
          await deleteS3Files([uploadedImageKey]);
        } catch (cleanupError) {
          console.error('Failed to cleanup uploaded image:', cleanupError);
          // Don't show user error for cleanup failure
        }
      }

      // Errors are surfaced by the auth hook
    }
  };

  const getRoleDisplayName = (role?: USER_ROLE) => {
    switch (role) {
      case USER_ROLE.ADMIN:
        return 'Administrator';
      case USER_ROLE.MANAGER:
        return 'Manager';
      case USER_ROLE.USER:
        return 'Team Member';
      default:
        return 'Team Member';
    }
  };

  return (
    <Card className='w-full max-w-3xl mx-auto shadow-lg'>
      <CardHeader className='bg-primary/5 border-b border-border/40'>
        <CardTitle className='text-center text-primary text-2xl font-bold'>
          Create Your Account
        </CardTitle>
      </CardHeader>

      <CardContent className='p-6 space-y-6'>
        {/* Invitation Status Banners */}
        {invitationCode && (
          <div>
            {isValidating ? (
              <div className='flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/40'>
                <Loader2 className='h-5 w-5 animate-spin text-primary' />
                <span className='text-sm text-muted-foreground'>Verifying invitation code...</span>
              </div>
            ) : isInvitationValid && validationData ? (
              <Alert className='border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'>
                <CheckCircle2 className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
                <AlertTitle className='font-semibold flex items-center gap-2'>
                  <span>Valid Invitation</span>
                  <Badge
                    variant='outline'
                    className='bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/40 text-xs'
                  >
                    <Shield className='h-3 w-3 mr-1' />
                    {getRoleDisplayName(validationData.role)}
                  </Badge>
                </AlertTitle>
                <AlertDescription className='text-xs mt-1 text-emerald-800 dark:text-emerald-300'>
                  You have been invited to join Workinley as a{' '}
                  <strong>{getRoleDisplayName(validationData.role)}</strong>. Your email is locked
                  to <strong>{validationData.email}</strong>.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant='destructive'>
                <AlertCircle className='h-5 w-5' />
                <AlertTitle className='font-semibold'>Invalid or Expired Invitation</AlertTitle>
                <AlertDescription className='text-xs mt-1'>
                  This invitation link is invalid or has already expired. You may still create a
                  standard account, but you will not receive the invited role automatically.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <SignUpForm
          form={form}
          onSubmit={signUpFormOnSubmit}
          isSubmitting={isSubmitting}
          isEmailLocked={isInvitationValid}
        />

        <div className='mt-6 text-center'>
          <p className='text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Link className='text-primary font-medium hover:underline' href={ROUTES.SIGN_IN}>
              Sign In
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const SignupPage = () => {
  return (
    <Suspense
      fallback={
        <Card className='w-full max-w-3xl mx-auto shadow-lg'>
          <CardHeader className='bg-primary/5 border-b border-border/40'>
            <Skeleton className='h-8 w-48 mx-auto' />
          </CardHeader>
          <CardContent className='p-6 space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </CardContent>
        </Card>
      }
    >
      <SignupContent />
    </Suspense>
  );
};

export default SignupPage;
