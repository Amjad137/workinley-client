// src/components/data-table/table-filters/search-filter.tsx
import { API_QUERY_PARAMS } from '@/constants/common.constants';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { useTableStore } from '@/stores/table-store';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface TableSearchFilterProps {
  placeholder?: string;
  paramKey?: API_QUERY_PARAMS;
  className?: string;
}

export const TableSearchFilter = ({
  placeholder = 'Search...',
  paramKey = API_QUERY_PARAMS.SEARCH,
  className = '',
}: TableSearchFilterProps) => {
  const { filters, setFilters } = useTableStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
    })),
  );

  const [inputValue, setInputValue] = useState<string>(
    filters[paramKey] != null ? String(filters[paramKey]) : '',
  );
  const debouncedValue = useDebounce(inputValue, 500);
  const pageValue = useMemo(() => filters[API_QUERY_PARAMS.PAGE], [filters]);

  // Update filter when debounced value changes
  useEffect(() => {
    if (pageValue && pageValue !== 1 && debouncedValue) {
      setFilters(API_QUERY_PARAMS.PAGE, 1);
    }
    setFilters(paramKey, debouncedValue);
  }, [debouncedValue, paramKey, setFilters, pageValue]);

  // Sync with external changes to the filter only when filters are reset
  useEffect(() => {
    // Only clear input if filters are completely empty (reset was called)
    if (Object.keys(filters).length === 0) {
      setInputValue('');
    }
  }, [filters]);

  return (
    <div className={cn('relative', className)}>
      <div className='flex w-full items-center justify-start h-9 gap-2 overflow-hidden rounded-md border border-input bg-background px-3 py-1'>
        <Search className='min-w-4 h-4 w-4 shrink-0 opacity-50' />
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className='h-full w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-0'
        />
        {inputValue && (
          <button
            type='button'
            onClick={() => {
              setInputValue('');
              if (pageValue && pageValue !== 1) {
                setFilters(API_QUERY_PARAMS.PAGE, 1);
              }
              setFilters(paramKey, '');
            }}
            className='text-muted-foreground hover:text-foreground'
            aria-label='Clear search'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>
    </div>
  );
};
