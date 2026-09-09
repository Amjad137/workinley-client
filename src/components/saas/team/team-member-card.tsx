'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes.constants';
import { IComplianceMember } from '@/dto/dashboard.dto';
import { cn } from '@/lib/utils';
import { getUserInitials } from '@/utils/user-utils';
import { format } from 'date-fns';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  RotateCcw,
  User,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

interface TeamMemberCardProps {
  member: IComplianceMember;
  weekNumber: number;
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
    className: string;
    icon: React.ElementType;
  }
> = {
  APPROVED: {
    label: 'Approved',
    badgeVariant: 'default',
    className:
      'bg-green-500/15 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    icon: CheckCircle2,
  },
  SUBMITTED: {
    label: 'Submitted',
    badgeVariant: 'secondary',
    className:
      'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    icon: FileText,
  },
  NEEDS_CORRECTION: {
    label: 'Needs Revision',
    badgeVariant: 'outline',
    className:
      'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    icon: XCircle,
  },
  DRAFT: {
    label: 'Draft',
    badgeVariant: 'secondary',
    className: 'bg-muted text-muted-foreground border-border',
    icon: FileText,
  },
  NOT_STARTED: {
    label: 'Not Started',
    badgeVariant: 'destructive',
    className: 'bg-destructive/15 text-destructive border-destructive/20',
    icon: AlertTriangle,
  },
};

const TeamMemberCard = ({ member, weekNumber }: TeamMemberCardProps) => {
  const { user, status, currentVersion, submittedAt } = member;
  const initials = getUserInitials(user);
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.NOT_STARTED;
  const StatusIcon = statusCfg.icon;

  return (
    <Card className='flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/40'>
      <CardHeader className='pb-3 pt-5 px-5'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3 min-w-0'>
            <Avatar className='h-11 w-11 border border-border shadow-xs shrink-0'>
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name ?? 'Member'}
                className='object-cover'
              />
              <AvatarFallback className='text-sm font-semibold'>{initials}</AvatarFallback>
            </Avatar>
            <div className='min-w-0 flex-1'>
              <h3 className='font-semibold text-foreground text-sm truncate' title={user.name}>
                {user.name || user.email}
              </h3>
              <p className='text-xs text-muted-foreground truncate' title={user.email}>
                {user.email}
              </p>
            </div>
          </div>
          {user.role && (
            <Badge variant='outline' className='text-[10px] uppercase font-semibold shrink-0'>
              {user.role}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className='py-3 px-5 space-y-3 flex-1'>
        {/* Compliance Status for Week */}
        <div
          className='flex items-center justify-between py-1.5 px-2.5 rounded-lg border text-xs font-medium'
          style={{}}
        >
          <span className='text-muted-foreground text-[11px] font-medium'>
            Week {weekNumber} Status
          </span>
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
              statusCfg.className,
            )}
          >
            <StatusIcon className='h-3.5 w-3.5' />
            <span>{statusCfg.label}</span>
          </div>
        </div>

        {/* Revisions & Submission Metadata */}
        <div className='grid grid-cols-2 gap-2 text-xs'>
          <div className='flex items-center gap-1.5 text-muted-foreground p-2 rounded-md bg-muted/40'>
            <RotateCcw className='h-3.5 w-3.5 shrink-0 text-muted-foreground/70' />
            <span className='text-[11px]'>Revisions:</span>
            <span className='font-medium text-foreground ml-auto'>
              {currentVersion > 0 ? `v${currentVersion}` : '-'}
            </span>
          </div>

          <div className='flex items-center gap-1.5 text-muted-foreground p-2 rounded-md bg-muted/40'>
            <Clock className='h-3.5 w-3.5 shrink-0 text-muted-foreground/70' />
            <span className='text-[11px]'>Submitted:</span>
            <span className='font-medium text-foreground ml-auto text-[11px] truncate'>
              {submittedAt ? format(new Date(submittedAt), 'MMM d') : '-'}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='pt-2 pb-4 px-5 border-t border-border/50 bg-muted/20'>
        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-between text-xs font-medium hover:text-primary'
          asChild
        >
          <Link href={ROUTES.TEAM_MEMBER(user.id)}>
            <span className='inline-flex items-center gap-1.5'>
              <User className='h-3.5 w-3.5' /> View Profile
            </span>
            <ArrowRight className='h-3.5 w-3.5 text-muted-foreground' />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamMemberCard;
