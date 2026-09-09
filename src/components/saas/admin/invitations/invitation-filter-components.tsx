'use client';

import { SelectFilter } from '@/components/ui/data-table/table-filter-select';
import { TableSearchFilter } from '@/components/ui/data-table/table-search-filter';
import { Button } from '@/components/ui/button';
import { API_QUERY_PARAMS } from '@/constants/common.constants';
import { USER_ROLE } from '@/constants/user.constants';
import { useTableStore } from '@/stores/table-store';
import { Filter, RotateCcw, Shield } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

const InvitationFilterComponents = () => {
  const { filters, resetFilters } = useTableStore(
    useShallow((state) => ({
      filters: state.filters,
      resetFilters: state.resetFilters,
    })),
  );

  const roleOptions = Object.values(USER_ROLE).map((role) => ({
    label: role === USER_ROLE.USER ? 'Team Member' : role.charAt(0) + role.slice(1).toLowerCase(),
    value: role,
  }));

  const statusOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Accepted / Used', value: 'USED' },
    { label: 'Expired', value: 'EXPIRED' },
  ];

  const hasActiveFilters = Object.keys(filters).some(
    (k) =>
      k !== API_QUERY_PARAMS.PAGE &&
      k !== API_QUERY_PARAMS.LIMIT &&
      filters[k] !== undefined &&
      filters[k] !== '',
  );

  return (
    <div className='flex flex-wrap items-center gap-3 w-full'>
      <TableSearchFilter
        placeholder='Search by email...'
        paramKey={API_QUERY_PARAMS.SEARCH}
        className='w-full sm:w-64'
      />

      <SelectFilter
        options={roleOptions}
        paramKey='role'
        placeholder='Filter by role'
        icon={<Shield className='h-4 w-4 text-muted-foreground' />}
        className='min-w-44'
      />

      <SelectFilter
        options={statusOptions}
        paramKey='status'
        placeholder='Filter by status'
        icon={<Filter className='h-4 w-4 text-muted-foreground' />}
        className='min-w-44'
      />

      {hasActiveFilters && (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => resetFilters()}
          className='h-9 px-3 text-xs text-muted-foreground hover:text-foreground'
        >
          <RotateCcw className='h-3.5 w-3.5 mr-1.5' />
          Reset Filters
        </Button>
      )}
    </div>
  );
};

export default InvitationFilterComponents;
