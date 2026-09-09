/* eslint-disable sonarjs/no-nested-conditional */
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetDashboardSummary,
  useGetComplianceMatrix,
  useGetTeamBlockers,
  useGetActivityFeed,
  useGetHoursDistribution,
  useGetProjectWorkload,
} from '@/hooks/use-dashboard';
import { getISOWeek } from 'date-fns';
import {
  Users,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Helper: current week ─────────────────────────────────────────────────────
function getCurrentWeekYear() {
  const now = new Date();
  return { weekNumber: getISOWeek(now), year: now.getFullYear() };
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  title,
  value,
  sub,
  icon: Icon,
  color = 'text-foreground',
  loading,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color?: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
        <Icon size={18} className={color} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className='h-8 w-20' />
        ) : (
          <>
            <div className={cn('text-3xl font-bold', color)}>{value}</div>
            {sub && <p className='text-xs text-muted-foreground mt-1'>{sub}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Compliance row ───────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  APPROVED: { label: 'Approved', color: 'text-green-500', icon: CheckCircle2 },
  SUBMITTED: { label: 'Submitted', color: 'text-blue-500', icon: FileText },
  NEEDS_CORRECTION: { label: 'Needs Correction', color: 'text-orange-400', icon: XCircle },
  DRAFT: { label: 'Draft', color: 'text-muted-foreground', icon: FileText },
  NOT_STARTED: { label: 'Not Started', color: 'text-destructive', icon: AlertTriangle },
};

// ─── Dashboard Page ───────────────────────────────────────────────────────────
const DashboardPage = () => {
  const { weekNumber, year } = getCurrentWeekYear();

  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary(weekNumber, year);
  const { data: compliance, isLoading: complianceLoading } = useGetComplianceMatrix(
    weekNumber,
    year,
  );
  const { data: blockers, isLoading: blockersLoading } = useGetTeamBlockers(weekNumber, year);
  const { data: activity, isLoading: activityLoading } = useGetActivityFeed();
  const { data: hours } = useGetHoursDistribution(weekNumber, year);
  const { data: workload } = useGetProjectWorkload(weekNumber, year);

  return (
    <div className='container mx-auto px-4 py-6 space-y-8'>
      {/* Page Header */}
      <div>
        <h1 className='text-2xl font-bold'>Team Dashboard</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Week {weekNumber} / {year} - Real-time team progress
        </p>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <KpiCard
          title='Total Members'
          value={summary?.totalUsers ?? 0}
          icon={Users}
          loading={summaryLoading}
        />
        <KpiCard
          title='Compliance Rate'
          value={`${summary?.complianceRate ?? 0}%`}
          sub='Members who submitted'
          icon={TrendingUp}
          color='text-primary'
          loading={summaryLoading}
        />
        <KpiCard
          title='Approved'
          value={summary?.approved ?? 0}
          sub={`${summary?.submitted ?? 0} pending review`}
          icon={FileCheck2}
          color='text-green-500'
          loading={summaryLoading}
        />
        <KpiCard
          title='Active Blockers'
          value={summary?.activeBlockers ?? 0}
          sub='Across all submitted reports'
          icon={AlertTriangle}
          color={summary?.activeBlockers ? 'text-orange-400' : 'text-muted-foreground'}
          loading={summaryLoading}
        />
      </div>

      {/* ── Status Breakdown ──────────────────────────────────────────────── */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
        {(
          [
            {
              key: 'approved',
              label: 'Approved',
              color: 'bg-green-500/10 text-green-600 border-green-200',
            },
            {
              key: 'submitted',
              label: 'Pending',
              color: 'bg-blue-500/10 text-blue-600 border-blue-200',
            },
            {
              key: 'needsCorrection',
              label: 'Needs Revision',
              color: 'bg-orange-500/10 text-orange-600 border-orange-200',
            },
            {
              key: 'draft',
              label: 'Draft',
              color: 'bg-secondary text-muted-foreground border-border',
            },
            {
              key: 'notStarted',
              label: 'Not Started',
              color: 'bg-destructive/10 text-destructive border-destructive/20',
            },
          ] as const
        ).map(({ key, label, color }) => (
          <div key={key} className={cn('rounded-lg border px-3 py-3 text-center', color)}>
            <div className='text-2xl font-bold'>{summaryLoading ? '-' : (summary?.[key] ?? 0)}</div>
            <div className='text-xs mt-0.5'>{label}</div>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* ── Compliance Matrix ─────────────────────────────────────────── */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle className='text-base'>Team Compliance Matrix</CardTitle>
            <CardDescription>Who has submitted their report this week</CardDescription>
          </CardHeader>
          <CardContent>
            {complianceLoading ? (
              <div className='space-y-3'>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className='h-10 w-full' />
                ))}
              </div>
            ) : (
              <div className='space-y-2'>
                {compliance.map((member) => {
                  const cfg = STATUS_CONFIG[member.status] ?? STATUS_CONFIG['NOT_STARTED'];
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
                        <p className='text-xs text-muted-foreground truncate'>
                          {member.user.email}
                        </p>
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

        {/* ── Hours Distribution ────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Hours Distribution</CardTitle>
            <CardDescription>Team-wide (submitted reports)</CardDescription>
          </CardHeader>
          <CardContent>
            {hours ? (
              <div className='space-y-3'>
                {Object.entries(hours).map(([category, value]) => {
                  const total = Object.values(hours).reduce((s, v) => s + (v as number), 0);
                  const pct = total > 0 ? Math.round(((value as number) / total) * 100) : 0;
                  return (
                    <div key={category}>
                      <div className='flex justify-between text-xs mb-1'>
                        <span className='capitalize'>{category}</span>
                        <span className='font-medium'>
                          {value as number}h ({pct}%)
                        </span>
                      </div>
                      <div className='w-full bg-muted rounded-full h-1.5'>
                        <div
                          className='bg-primary h-1.5 rounded-full transition-all'
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className='text-sm text-muted-foreground text-center py-6'>No hours data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* ── Active Blockers ───────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base flex items-center gap-2'>
              <AlertTriangle size={16} className='text-orange-400' /> Active Blockers
            </CardTitle>
            <CardDescription>Blockers flagged this week</CardDescription>
          </CardHeader>
          <CardContent>
            {blockersLoading ? (
              <div className='space-y-2'>
                {[1, 2].map((i) => (
                  <Skeleton key={i} className='h-12 w-full' />
                ))}
              </div>
            ) : blockers.length === 0 ? (
              <p className='text-sm text-muted-foreground text-center py-6'>
                🎉 No active blockers this week!
              </p>
            ) : (
              <div className='space-y-3'>
                {blockers.slice(0, 5).map((b) => (
                  <div
                    key={b.id}
                    className='flex items-start gap-3 p-2.5 bg-orange-50 dark:bg-orange-900/10 rounded-md'
                  >
                    <AlertTriangle size={13} className='text-orange-400 flex-shrink-0 mt-0.5' />
                    <div className='min-w-0'>
                      <p className='text-sm'>{b.description}</p>
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        {b.report?.user?.name ?? b.userName}
                      </p>
                    </div>
                    {(b.isKeyBlocker || b.isKeyIssue) && (
                      <Badge variant='destructive' className='text-xs flex-shrink-0'>
                        Key
                      </Badge>
                    )}
                  </div>
                ))}
                {blockers.length > 5 && (
                  <p className='text-xs text-muted-foreground text-center'>
                    +{blockers.length - 5} more
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Project Workload ──────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Project Workload</CardTitle>
            <CardDescription>Task distribution across projects this week</CardDescription>
          </CardHeader>
          <CardContent>
            {workload.length === 0 ? (
              <p className='text-sm text-muted-foreground text-center py-6'>No project data yet</p>
            ) : (
              <div className='space-y-3'>
                {workload.map((item) => (
                  <div key={item.project.id} className='flex items-center gap-3'>
                    <span
                      className='inline-block w-3 h-3 rounded-full flex-shrink-0'
                      style={{ backgroundColor: item.project.color }}
                    />
                    <div className='flex-1 min-w-0'>
                      <div className='flex justify-between text-xs mb-1'>
                        <span className='font-medium truncate'>{item.project.name}</span>
                        <span className='text-muted-foreground'>
                          {item.taskCount} tasks · {item.totalSpentHours}h
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Activity Feed ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Recent Activity</CardTitle>
          <CardDescription>Latest review actions</CardDescription>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <div className='space-y-3'>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className='h-12 w-full' />
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p className='text-sm text-muted-foreground text-center py-6'>No recent activity</p>
          ) : (
            <div className='space-y-3'>
              {activity.slice(0, 8).map((item) => {
                const isApprove = item.action === 'APPROVE';
                return (
                  <div key={item.id} className='flex items-start gap-3 py-2 border-b last:border-0'>
                    <div
                      className={cn(
                        'mt-0.5 flex-shrink-0',
                        isApprove ? 'text-green-500' : 'text-orange-400',
                      )}
                    >
                      {isApprove ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm'>
                        <strong>{item.reviewer?.name}</strong>{' '}
                        {isApprove ? 'approved' : 'requested changes on'}{' '}
                        <strong>{item.report?.user?.name}</strong>'s W{item.report?.weekNumber}{' '}
                        report
                      </p>
                      <p className='text-xs text-muted-foreground mt-0.5 truncate'>
                        {item.comment}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
