'use client';

import TeamFilterComponents from '@/components/saas/team/team-filter-components';
import TeamMemberCard from '@/components/saas/team/team-member-card';
import { PaginationWithLinks } from '@/components/ui/data-table/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { API_QUERY_PARAMS } from '@/constants/common.constants';
import { ROUTES } from '@/constants/routes.constants';
import { IComplianceQuery } from '@/dto/dashboard.dto';
import { useGetComplianceMatrix } from '@/hooks/use-dashboard';
import { useTableUrlSync } from '@/hooks/use-table-url-sync';
import { getCurrentWeekYear } from '@/utils/common-utils';
import { Inbox } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const StaffTeamPage = () => {
  const searchParams = useSearchParams();

  // Initialize URL sync for cards mode
  useTableUrlSync('cards');

  const { weekNumber, year } = getCurrentWeekYear();

  const queryParams: IComplianceQuery = {
    search: searchParams?.get(API_QUERY_PARAMS.SEARCH) ?? undefined,
    status: searchParams?.get(API_QUERY_PARAMS.STATUS) ?? undefined,
    page: searchParams?.get(API_QUERY_PARAMS.PAGE)
      ? Number(searchParams.get(API_QUERY_PARAMS.PAGE))
      : 1,
    limit: searchParams?.get(API_QUERY_PARAMS.LIMIT)
      ? Number(searchParams.get(API_QUERY_PARAMS.LIMIT))
      : 12,
    weekNumber,
    year,
  };

  const { data: members, pagination, isLoading } = useGetComplianceMatrix(queryParams);

  if (isLoading) {
    return (
      <div className='container mx-auto space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <Skeleton className='h-8 w-48 mb-2' />
            <Skeleton className='h-4 w-72' />
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border'>
          <Skeleton className='h-10 flex-1' />
          <Skeleton className='h-10 w-64' />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className='h-56 w-full rounded-xl' />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto space-y-6 p-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Team Compliance</h1>
          <p className='text-muted-foreground text-sm mt-1'>
            Week {weekNumber}, {year} compliance overview & performance tracking
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className='flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border border-border shadow-xs'>
        <TeamFilterComponents />
      </div>

      {/* Card Grid */}
      {members.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border bg-card/50'>
          <Inbox className='h-12 w-12 text-muted-foreground/40 mb-3' />
          <h3 className='font-semibold text-foreground text-lg'>No Members Found</h3>
          <p className='text-sm text-muted-foreground mt-1 max-w-sm'>
            {queryParams.search || queryParams.status
              ? 'Try adjusting your search criteria or status filter.'
              : 'No team members found for this compliance period.'}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr'>
          {members.map((member) => (
            <TeamMemberCard
              key={member.user.id}
              member={member}
              weekNumber={weekNumber}
              href={ROUTES.STAFF_TEAM_MEMBER(member.user.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && <PaginationWithLinks pagination={pagination} isTable={false} />}
    </div>
  );
};

export default StaffTeamPage;
