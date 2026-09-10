'use client';

import ReportDetailDialog from '@/components/saas/reports/table-action-components/report-detail-dialog';
import MemberKpiCards from '@/components/saas/team/profile/member-kpi-cards';
import MemberProfileHeader from '@/components/saas/team/profile/member-profile-header';
import MemberProfileSkeleton from '@/components/saas/team/profile/member-profile-skeleton';
import MemberReportsCards from '@/components/saas/team/profile/member-reports-cards';
import MemberStatusBreakdown from '@/components/saas/team/profile/member-status-breakdown';
import { Button } from '@/components/ui/button';
import { REPORT_STATUS } from '@/constants/report.constants';
import { ROUTES } from '@/constants/routes.constants';
import { useGetMemberStats } from '@/hooks/use-dashboard';
import { useGetReportById } from '@/hooks/use-reports';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { use, useState } from 'react';

type PageProps = {
  params: Promise<{ userId: string }>;
};

export default function StaffTeamMemberProfilePage({ params }: PageProps) {
  const { userId } = use(params);

  const { data: stats, isLoading } = useGetMemberStats(userId);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: selectedReport } = useGetReportById(selectedReportId ?? '', {
    enabled: !!selectedReportId && detailOpen,
  });

  const handleOpenReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setDetailOpen(true);
  };

  if (isLoading || !stats) {
    return <MemberProfileSkeleton />;
  }

  const statusCounts = stats.statusCounts || {};

  return (
    <div className='container mx-auto px-4 py-6 space-y-6'>
      {/* Back navigation to Staff Team */}
      <div>
        <Button
          variant='ghost'
          size='sm'
          className='gap-2 text-muted-foreground hover:text-foreground'
          asChild
        >
          <Link href={ROUTES.STAFF_TEAM}>
            <ArrowLeft size={16} /> Back to Team
          </Link>
        </Button>
      </div>

      {/* Member Profile Header */}
      <MemberProfileHeader user={stats.user} />

      {/* KPI Stats Cards */}
      <MemberKpiCards
        totalReports={stats.totalReports ?? 0}
        totalTasks={stats.totalTasks ?? 0}
        approvedCount={statusCounts[REPORT_STATUS.APPROVED] ?? 0}
        pendingReviewCount={statusCounts[REPORT_STATUS.SUBMITTED] ?? 0}
        avgRevisions={stats.avgRevisions ?? 0}
      />

      {/* Status Breakdown Pills */}
      <MemberStatusBreakdown statusCounts={statusCounts} />

      {/* Recent Reports Cards */}
      <MemberReportsCards reports={stats.recentReports || []} onViewReport={handleOpenReport} />

      {/* Report Detail Dialog */}
      {detailOpen && selectedReport && (
        <ReportDetailDialog open={detailOpen} setOpen={setDetailOpen} report={selectedReport} />
      )}
    </div>
  );
}
