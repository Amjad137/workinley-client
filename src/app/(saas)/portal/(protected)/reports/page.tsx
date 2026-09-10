'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PaginationWithLinks } from '@/components/ui/data-table/pagination';
import ReportsFilterComponents from '@/components/saas/reports/reports-filter-components';
import ReportCard from '@/components/saas/reports/report-card';
import ReportSheet from '@/components/saas/reports/report-sheet';
import { API_QUERY_PARAMS, ENTITY_SORT } from '@/constants/common.constants';
import { REPORT_QUERY_PARAMS, REPORT_STATUS, SORT_REPORT_BY } from '@/constants/report.constants';
import { IReportQuery, IWeeklyReport } from '@/dto/report.dto';
import { useTableUrlSync } from '@/hooks/use-table-url-sync';
import { useGetMyReports } from '@/hooks/use-reports';
import { Inbox, Plus } from 'lucide-react';

const ReportsPage = () => {
  const searchParams = useSearchParams();

  // Initialize URL sync for cards mode
  useTableUrlSync('cards');

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<IWeeklyReport | null>(null);

  const handleOpenCreate = () => {
    setEditingReport(null);
    setSheetOpen(true);
  };

  const handleOpenEdit = (report: IWeeklyReport) => {
    setEditingReport(report);
    setSheetOpen(true);
  };

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
      : 12,
    status: (searchParams.get(REPORT_QUERY_PARAMS.STATUS) as REPORT_STATUS) ?? undefined,
    weekNumber: searchParams.get(REPORT_QUERY_PARAMS.WEEK_NUMBER)
      ? Number(searchParams.get(REPORT_QUERY_PARAMS.WEEK_NUMBER))
      : undefined,
    year: searchParams.get(REPORT_QUERY_PARAMS.YEAR)
      ? Number(searchParams.get(REPORT_QUERY_PARAMS.YEAR))
      : undefined,
  };

  const { data: reports, pagination, isLoading } = useGetMyReports(queryParams);

  if (isLoading) {
    return (
      <div className='container mx-auto space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <Skeleton className='h-8 w-48 mb-2' />
            <Skeleton className='h-4 w-72' />
          </div>
          <Skeleton className='h-9 w-32' />
        </div>

        <div className='flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border'>
          <Skeleton className='h-10 flex-1' />
          <Skeleton className='h-10 w-48' />
          <Skeleton className='h-10 w-44' />
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
          <h1 className='text-2xl font-bold text-foreground'>My Weekly Reports</h1>
          <p className='text-muted-foreground text-sm mt-1'>
            Track, create, and manage your weekly accomplishments, tasks, and hours
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button size='sm' onClick={handleOpenCreate} id='create-report-btn' className='gap-1.5'>
            <Plus className='h-4 w-4' /> New Report
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className='flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border border-border shadow-xs'>
        <ReportsFilterComponents />
      </div>

      {/* Cards Grid */}
      {!reports || reports.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border bg-card/50'>
          <Inbox className='h-12 w-12 text-muted-foreground/40 mb-3' />
          <h3 className='font-semibold text-foreground text-lg'>No Reports Found</h3>
          <p className='text-sm text-muted-foreground mt-1 max-w-sm'>
            {queryParams.search || queryParams.status || queryParams.weekNumber
              ? 'Try adjusting your search criteria or status filter.'
              : 'You haven’t created any weekly reports yet. Click "New Report" to submit your first report.'}
          </p>
          {!queryParams.search && !queryParams.status && !queryParams.weekNumber && (
            <Button size='sm' variant='outline' onClick={handleOpenCreate} className='mt-4 gap-1.5'>
              <Plus className='h-4 w-4' /> Create Report
            </Button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr'>
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} onEdit={handleOpenEdit} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && <PaginationWithLinks pagination={pagination} isTable={false} />}

      {/* Create / Edit Sheet */}
      {sheetOpen && (
        <ReportSheet
          open={sheetOpen}
          setOpen={(open) => {
            setSheetOpen(open);
            if (!open) setEditingReport(null);
          }}
          report={editingReport}
        />
      )}
    </div>
  );
};

export default ReportsPage;
