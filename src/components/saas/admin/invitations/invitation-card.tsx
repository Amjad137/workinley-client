'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { USER_ROLE } from '@/constants/user.constants';
import { IUserInvitation } from '@/dto/user-invitation.dto';
import { useDeleteUserInvitation, useResendUserInvitation } from '@/hooks/use-user-invitations';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/utils/error-handler';
import { format, isAfter } from 'date-fns';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  MoreVertical,
  RotateCcw,
  Shield,
  Trash2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
  invitation: IUserInvitation;
}

const InvitationCard = ({ invitation }: Props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { mutateAsync: resendInvite, isPending: isResending } = useResendUserInvitation();
  const { mutateAsync: deleteInvite, isPending: isDeleting } = useDeleteUserInvitation();

  const id = invitation.id;
  const isExpired = !invitation.isUsed && !isAfter(new Date(invitation.expiresAt), new Date());
  const isPending = !invitation.isUsed && !isExpired;

  const inviteUrl =
    invitation.inviteLink ||
    `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/sign-up?invitation_code=${invitation.invitationCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast({
        title: 'Link Copied',
        description: 'Invitation signup link copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Copy Failed',
        description: 'Could not copy link to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleResend = async () => {
    try {
      await resendInvite(id);
    } catch (error) {
      toast({
        title: 'Error!',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInvite(id);
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error!',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const getRoleBadgeVariant = (role: USER_ROLE) => {
    switch (role) {
      case USER_ROLE.ADMIN:
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case USER_ROLE.MANAGER:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <>
      <Card className='relative flex flex-col justify-between overflow-hidden border border-border/80 hover:border-primary/40 hover:shadow-md transition-all duration-200 rounded-xl bg-card'>
        <CardHeader className='pb-3 pt-5 px-5'>
          <div className='flex items-start justify-between gap-2'>
            <div className='flex items-center gap-3 min-w-0 flex-1'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted border border-border'>
                <Mail className='h-5 w-5 text-muted-foreground' />
              </div>
              <div className='min-w-0 flex-1'>
                <h3
                  className='font-semibold text-sm text-foreground truncate'
                  title={invitation.email}
                >
                  {invitation.email}
                </h3>
                <div className='flex items-center gap-1.5 mt-1'>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeVariant(
                      invitation.role,
                    )}`}
                  >
                    <Shield className='h-3 w-3 mr-1' />
                    {invitation.role === USER_ROLE.USER ? 'Team Member' : invitation.role}
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Dots Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-muted-foreground hover:text-foreground shrink-0'
                  disabled={isResending || isDeleting}
                >
                  {isResending || isDeleting ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <MoreVertical className='h-4 w-4' />
                  )}
                  <span className='sr-only'>Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuItem onClick={handleCopyLink} className='cursor-pointer'>
                  <Copy className='h-4 w-4 mr-2 text-muted-foreground' />
                  {copied ? 'Copied!' : 'Copy Invite Link'}
                </DropdownMenuItem>

                {!invitation.isUsed && (
                  <DropdownMenuItem
                    onClick={handleResend}
                    disabled={isResending}
                    className='cursor-pointer'
                  >
                    <RotateCcw className='h-4 w-4 mr-2 text-muted-foreground' />
                    Resend / Renew
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className='cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10'
                >
                  <Trash2 className='h-4 w-4 mr-2' />
                  Revoke Invitation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className='px-5 pb-5 pt-0 space-y-4'>
          {/* Status Badge */}
          <div className='flex items-center justify-between pt-2 border-t border-border/60'>
            <span className='text-xs text-muted-foreground'>Status</span>
            {invitation.isUsed && (
              <Badge
                variant='outline'
                className='bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 gap-1 text-xs py-0.5'
              >
                <CheckCircle2 className='h-3 w-3' />
                Accepted
              </Badge>
            )}
            {isExpired && (
              <Badge
                variant='outline'
                className='bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 gap-1 text-xs py-0.5'
              >
                <XCircle className='h-3 w-3' />
                Expired
              </Badge>
            )}
            {isPending && (
              <Badge
                variant='outline'
                className='bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 gap-1 text-xs py-0.5'
              >
                <Clock className='h-3 w-3' />
                Pending
              </Badge>
            )}
          </div>

          {/* Timing details */}
          <div className='space-y-1.5 text-xs text-muted-foreground'>
            <div className='flex items-center justify-between'>
              <span className='flex items-center gap-1.5'>
                <Calendar className='h-3.5 w-3.5 opacity-60' />
                Invited
              </span>
              <span className='font-medium text-foreground/80'>
                {invitation.createdAt
                  ? format(new Date(invitation.createdAt), 'MMM dd, yyyy')
                  : 'N/A'}
              </span>
            </div>

            {invitation.isUsed && invitation.usedAt && (
              <div className='flex items-center justify-between'>
                <span className='flex items-center gap-1.5'>
                  <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500 opacity-80' />
                  Joined
                </span>
                <span className='font-medium text-foreground/80'>
                  {format(new Date(invitation.usedAt), 'MMM dd, yyyy')}
                </span>
              </div>
            )}

            {isPending && (
              <div className='flex items-center justify-between'>
                <span className='flex items-center gap-1.5'>
                  <Clock className='h-3.5 w-3.5 opacity-60' />
                  Expires
                </span>
                <span className='font-medium text-foreground/80'>
                  {invitation.expiresAt
                    ? format(new Date(invitation.expiresAt), 'MMM dd, yyyy')
                    : 'N/A'}
                </span>
              </div>
            )}

            {isExpired && (
              <div className='flex items-center justify-between'>
                <span className='flex items-center gap-1.5 text-destructive'>
                  <XCircle className='h-3.5 w-3.5 opacity-80' />
                  Expired
                </span>
                <span className='font-medium text-destructive'>
                  {invitation.expiresAt
                    ? format(new Date(invitation.expiresAt), 'MMM dd, yyyy')
                    : 'N/A'}
                </span>
              </div>
            )}

            {invitation.invitedBy && (
              <div className='flex items-center justify-between pt-1 border-t border-border/40 text-[11px]'>
                <span>Invited by</span>
                <span className='truncate max-w-[140px] text-foreground/70'>
                  {invitation.invitedBy.name || invitation.invitedBy.email}
                </span>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          {isPending && (
            <Button
              variant='outline'
              size='sm'
              onClick={handleCopyLink}
              className='w-full text-xs h-8 gap-1.5 border-dashed hover:border-solid hover:bg-muted/60'
            >
              <Copy className='h-3.5 w-3.5' />
              {copied ? 'Link Copied!' : 'Copy Invitation Link'}
            </Button>
          )}

          {isExpired && (
            <Button
              variant='outline'
              size='sm'
              onClick={handleResend}
              disabled={isResending}
              className='w-full text-xs h-8 gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10'
            >
              {isResending ? (
                <Loader2 className='h-3.5 w-3.5 animate-spin' />
              ) : (
                <RotateCcw className='h-3.5 w-3.5' />
              )}
              Renew & Resend Link
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Revoke Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className='sm:max-w-[400px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-destructive'>
              <Trash2 className='h-5 w-5' />
              Revoke Invitation
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke the invitation for{' '}
              <strong className='text-foreground'>{invitation.email}</strong>? The signup link will
              no longer be valid.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2 sm:gap-0 pt-2'>
            <Button
              variant='outline'
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvitationCard;
