'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IComplianceMember } from '@/dto/dashboard.dto';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, FileText, XCircle } from 'lucide-react';
import React from 'react';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  APPROVED: { label: 'Approved', color: 'text-green-500', icon: CheckCircle2 },
  SUBMITTED: { label: 'Submitted', color: 'text-blue-500', icon: FileText },
  NEEDS_CORRECTION: { label: 'Needs Correction', color: 'text-orange-400', icon: XCircle },
  DRAFT: { label: 'Draft', color: 'text-muted-foreground', icon: FileText },
  NOT_STARTED: { label: 'Not Started', color: 'text-destructive', icon: AlertTriangle },
};

interface StaffComplianceMatrixProps {
  compliance: IComplianceMember[];
  isLoading: boolean;
}

export const StaffComplianceMatrix = ({ compliance, isLoading }: StaffComplianceMatrixProps) => {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle className='text-base'>Team Compliance Matrix</CardTitle>
        <CardDescription>Who has submitted their report this week</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-10 w-full' />
            ))}
          </div>
        ) : (
          <div className='space-y-2'>
            {compliance.map((member) => {
              const cfg = STATUS_CONFIG[member.status] ?? STATUS_CONFIG.NOT_STARTED;
              const StatusIcon = cfg.icon;
              const initials = (member.user.name || member.user.email || 'U')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={member.user.id}
                  className='flex items-center gap-3 py-2 border-b last:border-0'
                >
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src={member.user.image ?? undefined} />
                    <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium truncate'>{member.user.name}</p>
                    <p className='text-xs text-muted-foreground truncate'>{member.user.email}</p>
                  </div>
                  <div className={cn('flex items-center gap-1.5', cfg.color)}>
                    <StatusIcon size={14} />
                    <span className='text-xs font-medium'>{cfg.label}</span>
                  </div>
                  {member.currentVersion > 1 && (
                    <Badge variant='secondary' className='text-xs'>
                      v{member.currentVersion}
                    </Badge>
                  )}
                </div>
              );
            })}
            {compliance.length === 0 && (
              <p className='text-sm text-muted-foreground text-center py-6'>
                No team members found
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffComplianceMatrix;
