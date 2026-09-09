'use client';

import { useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table/data-table';
import PageLoader from '@/components/saas/shared/page-loader';
import ReportsFilterComponents from '@/components/saas/reports/reports-filter-components';
import { reviewsTableColumns } from '@/components/saas/reviews/reviews-table-columns';
import { API_QUERY_PARAMS, ENTITY_SORT } from '@/constants/common.constants';
import { REPORT_QUERY_PARAMS, REPORT_STATUS, SORT_REPORT_BY } from '@/constants/report.constants';
import { IReportQuery } from '@/dto/report.dto';
import { useTableUrlSync } from '@/hooks/use-table-url-sync';
import { useGetAllTeamReports } from '@/hooks/use-reports';

const ReviewsPage = () => {
  const searchParams = useSearchParams();
  useTableUrlSync();

  const queryParams: IReportQuery = {
    search: searchParams.get(API_QUERY_PARAMS.SEARCH) ?? undefined,
    sortBy: (searchParams.get(API_QUERY_PARAMS.SORT_BY) as SORT_REPORT_BY) ?? undefined,
    sortOrder: (searchParams.get(API_QUERY_PARAMS.SORT_ORDER) as ENTITY_SORT) ?? ENTITY_SORT.DESC,
    page: searchParams.get(API_QUERY_PARAMS.PAGE)
      ? Number(searchParams.get(API_QUERY_PARAMS.PAGE))
      : 1,
    limit: searchParams.get(API_QUERY_PARAMS.LIMIT)
      ? Number(searchParams.get(API_QUERY_PARAMS.LIMIT))
      : 20,
    status: (searchParams.get(REPORT_QUERY_PARAMS.STATUS) as REPORT_STATUS) ?? undefined,
    weekNumber: searchParams.get(REPORT_QUERY_PARAMS.WEEK_NUMBER)
      ? Number(searchParams.get(REPORT_QUERY_PARAMS.WEEK_NUMBER))
      : undefined,
    userId: searchParams.get(REPORT_QUERY_PARAMS.USER_ID) ?? undefined,
    projectId: searchParams.get(REPORT_QUERY_PARAMS.PROJECT_ID) ?? undefined,
  };

  const { data: reports, pagination, isLoading } = useGetAllTeamReports(queryParams);

  if (isLoading) return <PageLoader />;

  return (
    <div className='container mx-auto flex h-full w-full gap-2 flex-col justify-start'>
      <DataTable
        columns={reviewsTableColumns}
        data={reports || []}
        pagination={pagination}
        filterComponents={<ReportsFilterComponents showUserFilter />}
      />
    </div>
  );
};

export default ReviewsPage;
