import { SelectFilter } from '@/components/ui/data-table/table-filter-select';
import { TableSearchFilter } from '@/components/ui/data-table/table-search-filter';
import { API_QUERY_PARAMS } from '@/constants/common.constants';
import { PROJECT_QUERY_PARAMS, PROJECT_STATUS } from '@/constants/project.constants';
import { Filter } from 'lucide-react';

const ProjectsFilterComponents = () => {
  return (
    <div className='flex flex-wrap gap-3'>
      <TableSearchFilter
        placeholder='Search projects...'
        paramKey={API_QUERY_PARAMS.SEARCH}
        className='md:w-48'
      />
      <SelectFilter
        options={[
          { label: 'Active', value: PROJECT_STATUS.ACTIVE },
          { label: 'Archived', value: PROJECT_STATUS.ARCHIVED },
        ]}
        paramKey={PROJECT_QUERY_PARAMS.STATUS}
        placeholder='Filter by status'
        icon={<Filter className='h-4 w-4' />}
        className='min-w-48'
      />
    </div>
  );
};

export default ProjectsFilterComponents;
