import { SelectFilter } from '@/components/ui/data-table/table-filter-select';
import { TableSearchFilter } from '@/components/ui/data-table/table-search-filter';
import { API_QUERY_PARAMS } from '@/constants/common.constants';
import { REPORT_STATUS } from '@/constants/report.constants';
import { Filter } from 'lucide-react';

const STATUS_OPTIONS = [
  { label: 'Approved', value: REPORT_STATUS.APPROVED },
  { label: 'Submitted', value: REPORT_STATUS.SUBMITTED },
  { label: 'Needs Correction', value: REPORT_STATUS.NEEDS_CORRECTION },
  { label: 'Draft', value: REPORT_STATUS.DRAFT },
  { label: 'Not Started', value: 'NOT_STARTED' },
];

const TeamFilterComponents = () => {
  return (
    <div className='flex flex-wrap gap-3 w-full'>
      <TableSearchFilter
        placeholder='Search members...'
        paramKey={API_QUERY_PARAMS.SEARCH}
        className='w-full sm:w-64'
      />
      <SelectFilter
        options={STATUS_OPTIONS}
        paramKey={API_QUERY_PARAMS.STATUS}
        placeholder='Filter by status'
        icon={<Filter className='h-4 w-4' />}
        className='min-w-48'
      />
    </div>
  );
};

export default TeamFilterComponents;
