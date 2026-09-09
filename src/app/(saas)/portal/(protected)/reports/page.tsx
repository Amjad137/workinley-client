'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table/data-table';
import { Button } from '@/components/ui/button';
import PageLoader from '@/components/saas/shared/page-loader';
import ReportsFilterComponents from '@/components/saas/reports/reports-filter-components';
import { reportsTableColumns } from '@/components/saas/reports/reports-table-columns';
import ReportSheet from '@/components/saas/reports/report-sheet';
import { API_QUERY_PARAMS, ENTITY_SORT } from '@/constants/common.constants';
import { REPORT_QUERY_PARAMS, REPORT_STATUS, SORT_REPORT_BY } from '@/constants/report.constants';
import { IReportQuery } from '@/dto/report.dto';
import { useTableUrlSync } from '@/hooks/use-table-url-sync';
import { useGetMyReports } from '@/hooks/use-reports';
import { Plus } from 'lucide-react';

const ReportsPage = () => {
  const searchParams = useSearchParams();
  useTableUrlSync();

  const [openCreateSheet, setOpenCreateSheet] = useState(false);

  const queryParams: IReportQuery = {
    search: searchParams.get(API_QUERY_PARAMS.SEARCH) ?? undefined,
    sortBy:
      (searchParams.get(API_QUERY_PARAMS.SORT_BY) as SORT_REPORT_BY) ??
      SORT_REPORT_BY.WEEK_START_DATE,
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
    year: searchParams.get(REPORT_QUERY_PARAMS.YEAR)
      ? Number(searchParams.get(REPORT_QUERY_PARAMS.YEAR))
      : undefined,
  };

  const { data: reports, pagination, isLoading } = useGetMyReports(queryParams);

  if (isLoading) return <PageLoader />;

  return (
    <div className='container mx-auto flex h-full w-full gap-2 flex-col justify-start'>
      <DataTable
        columns={reportsTableColumns}
        data={reports || []}
        pagination={pagination}
        filterComponents={<ReportsFilterComponents />}
        actionComponents={() => (
          <div className='flex items-center gap-2'>
            <Button size='sm' onClick={() => setOpenCreateSheet(true)} id='create-report-btn'>
              <Plus className='mr-1 h-4 w-4' /> New Report
            </Button>
          </div>
        )}
      />

      {openCreateSheet && <ReportSheet open={openCreateSheet} setOpen={setOpenCreateSheet} />}
    </div>
  );
};

export default ReportsPage;
