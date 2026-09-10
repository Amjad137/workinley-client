'use client';

import ReportDetailDialog from '@/components/saas/reports/table-action-components/report-detail-dialog';
import { PROJECT_STATUS } from '@/constants/project.constants';
import { REPORT_STATUS } from '@/constants/report.constants';
import { useGetMemberStats } from '@/hooks/use-dashboard';
import { useGetAllProjects } from '@/hooks/use-projects';
import { useGetMyReports, useGetReportById } from '@/hooks/use-reports';
import { useAuthStore } from '@/stores/auth.store';
import { getCurrentWeekYear } from '@/utils/common-utils';
import { useState } from 'react';
import UserActiveProjects from './user-active-projects';
import UserCurrentWeekBanner from './user-current-week-banner';
import UserDashboardHeader from './user-dashboard-header';
import UserKpiCards from './user-kpi-cards';
import UserRecentReports from './user-recent-reports';

export const UserDashboard = () => {
  const { user } = useAuthStore();
  const { weekNumber, year } = getCurrentWeekYear();

  // Queries
  const { data: stats, isLoading: statsLoading } = useGetMemberStats(user?.id ?? '', {
    enabled: !!user?.id,
  });
  const { data: myReports, isLoading: reportsLoading } = useGetMyReports({ limit: 10 });
  const { data: projects, isLoading: projectsLoading } = useGetAllProjects({
    limit: 6,
    status: PROJECT_STATUS.ACTIVE,
  });

  // Report quick detail dialog state
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: selectedReport } = useGetReportById(selectedReportId ?? '', {
    enabled: !!selectedReportId && detailOpen,
  });

  const handleOpenReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setDetailOpen(true);
  };

  // Find report for the current week
  const currentWeekReport = myReports?.find((r) => r.weekNumber === weekNumber && r.year === year);

  const statusCounts = stats?.statusCounts ?? {};
  const approvedCount = statusCounts[REPORT_STATUS.APPROVED] ?? 0;
  const pendingCount = statusCounts[REPORT_STATUS.SUBMITTED] ?? 0;

  return (
    <div className='container mx-auto px-4 py-6 space-y-6'>
      {/* Header */}
      <UserDashboardHeader user={user} weekNumber={weekNumber} year={year} />

      {/* Current Week Status Banner */}
      <UserCurrentWeekBanner
        currentWeekReport={currentWeekReport}
        weekNumber={weekNumber}
        year={year}
      />

      {/* KPI Cards */}
      <UserKpiCards
        totalReports={stats?.totalReports ?? myReports?.length ?? 0}
        approvedCount={approvedCount}
        pendingCount={pendingCount}
        totalTasks={stats?.totalTasks ?? 0}
        isLoading={statsLoading || reportsLoading}
      />

      {/* Main Grid: Recent Reports & Active Projects */}
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
        <div className='lg:col-span-3'>
          <UserRecentReports
            reports={myReports ?? []}
            isLoading={reportsLoading}
            onViewReport={handleOpenReport}
          />
        </div>
        <div className='lg:col-span-2'>
          <UserActiveProjects projects={projects ?? []} isLoading={projectsLoading} />
        </div>
      </div>

      {/* Quick Report Detail Dialog */}
      {detailOpen && selectedReport && (
        <ReportDetailDialog open={detailOpen} setOpen={setDetailOpen} report={selectedReport} />
      )}
    </div>
  );
};

export default UserDashboard;
