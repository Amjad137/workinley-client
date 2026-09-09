import { SelectFilter } from '@/components/ui/data-table/table-filter-select';
import { TableSearchFilter } from '@/components/ui/data-table/table-search-filter';
import { API_QUERY_PARAMS } from '@/constants/common.constants';
import {
  REPORT_STATUS,
  REPORT_STATUS_LABELS,
  REPORT_QUERY_PARAMS,
} from '@/constants/report.constants';
import { Filter } from 'lucide-react';

type Props = {
  showUserFilter?: boolean;
};

const ReportsFilterComponents = ({ showUserFilter = false }: Props) => {
  const statusOptions = Object.values(REPORT_STATUS).map((s) => ({
    label: REPORT_STATUS_LABELS[s],
    value: s,
  }));

  // Build week number options for current year (simplified: last 12 weeks)
  const currentWeek = Math.ceil(
    ((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 86400000 +
      new Date(new Date().getFullYear(), 0, 1).getDay() +
      1) /
      7,
  );
  const weekOptions = Array.from({ length: 12 }, (_, i) => {
    const wn = currentWeek - i;
    return wn > 0 ? { label: `Week ${wn}`, value: String(wn) } : null;
  }).filter(Boolean) as { label: string; value: string }[];

  return (
    <div className='flex flex-wrap gap-3'>
      <TableSearchFilter
        placeholder='Search reports...'
        paramKey={API_QUERY_PARAMS.SEARCH}
        className='md:w-48'
      />
      <SelectFilter
        options={statusOptions}
        paramKey={REPORT_QUERY_PARAMS.STATUS}
        placeholder='Filter by status'
        icon={<Filter className='h-4 w-4' />}
        className='min-w-52'
      />
      <SelectFilter
        options={weekOptions}
        paramKey={REPORT_QUERY_PARAMS.WEEK_NUMBER}
        placeholder='Filter by week'
        icon={<Filter className='h-4 w-4' />}
        className='min-w-44'
      />
    </div>
  );
};

export default ReportsFilterComponents;
