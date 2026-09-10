'use client';

import {
  StaffActivityFeed,
  StaffComplianceMatrix,
  StaffDashboardHeader,
  StaffHoursDistribution,
  StaffKpiCards,
  StaffProjectWorkload,
  StaffStatusBreakdown,
  StaffTeamBlockers,
} from '@/components/saas/dashboards/staff';
import {
  useGetActivityFeed,
  useGetComplianceMatrix,
  useGetDashboardSummary,
  useGetHoursDistribution,
  useGetProjectWorkload,
  useGetTeamBlockers,
} from '@/hooks/use-dashboard';
import { getCurrentWeekYear } from '@/utils/common-utils';

const StaffDashboardPage = () => {
  const { weekNumber, year } = getCurrentWeekYear();

  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary(weekNumber, year);
  const { data: compliance, isLoading: complianceLoading } = useGetComplianceMatrix(
    weekNumber,
    year,
  );
  const { data: blockers, isLoading: blockersLoading } = useGetTeamBlockers(weekNumber, year);
  const { data: activity, isLoading: activityLoading } = useGetActivityFeed();
  const { data: hours, isLoading: hoursLoading } = useGetHoursDistribution(weekNumber, year);
  const { data: workload, isLoading: workloadLoading } = useGetProjectWorkload(weekNumber, year);

  return (
    <div className='container mx-auto px-4 py-6 space-y-8'>
      {/* Page Header */}
      <StaffDashboardHeader weekNumber={weekNumber} year={year} />

      {/* KPI Cards */}
      <StaffKpiCards summary={summary} isLoading={summaryLoading} />

      {/* Status Breakdown Pills */}
      <StaffStatusBreakdown summary={summary} isLoading={summaryLoading} />

      {/* Compliance Matrix & Hours Distribution */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <StaffComplianceMatrix compliance={compliance} isLoading={complianceLoading} />
        </div>
        <div>
          <StaffHoursDistribution hours={hours} isLoading={hoursLoading} />
        </div>
      </div>

      {/* Blockers & Project Workload */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <StaffTeamBlockers blockers={blockers} isLoading={blockersLoading} />
        <StaffProjectWorkload workload={workload} isLoading={workloadLoading} />
      </div>

      {/* Activity Feed */}
      <StaffActivityFeed activity={activity} isLoading={activityLoading} />
    </div>
  );
};

export default StaffDashboardPage;
