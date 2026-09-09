import { API_QUERY_PARAMS } from '@/constants/common.constants';
import { FilterValue, useTableStore } from '@/stores/table-store';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

export function useTableUrlSync(mode: 'table' | 'cards' = 'table') {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasInitialized = useRef(false);
  const lastUrlParams = useRef<string>('');
  const { filters, setFilters } = useTableStore(
    useShallow((state) => ({
      filters: state.filters,
      setFilters: state.setFilters,
    })),
  );

  // Load initial filters from URL
  useEffect(() => {
    if (hasInitialized.current) return;
    console.log('Initializing from URL');

    const urlParams: Record<string, FilterValue> = {};

    // Extract params from URL
    searchParams.forEach((value, key) => {
      // Handle numeric values
      if (/^\d+$/.test(value)) {
        urlParams[key] = Number(value);
      } else if (value === 'true' || value === 'false') {
        urlParams[key] = value === 'true';
      } else {
        urlParams[key] = value;
      }
    });

    Object.entries(urlParams).forEach(([key, value]) => {
      setFilters(key as API_QUERY_PARAMS, value);
    });

    lastUrlParams.current = searchParams.toString();
    hasInitialized.current = true;
  }, [searchParams, setFilters]);

  // For table mode: Full bidirectional sync
  useEffect(() => {
    if (!hasInitialized.current || mode !== 'table') return;

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });

    const newParamsString = params.toString();
    if (newParamsString !== lastUrlParams.current) {
      console.log('Table mode: syncing filters to URL');
      router.replace(`${pathname}?${newParamsString}`, { scroll: false });
      lastUrlParams.current = newParamsString;
    }
  }, [filters, pathname, router, mode]);

  // For cards mode: Only sync non-pagination filters from store to URL
  useEffect(() => {
    if (!hasInitialized.current || mode !== 'cards') return;

    const currentParams = new URLSearchParams(searchParams.toString());
    const paginationParams = {
      page: currentParams.get(API_QUERY_PARAMS.PAGE),
      limit: currentParams.get(API_QUERY_PARAMS.LIMIT),
      skip: currentParams.get('skip'),
    };

    const params = new URLSearchParams();

    // Preserve pagination params from URL
    if (paginationParams.page) params.set(API_QUERY_PARAMS.PAGE, paginationParams.page);
    if (paginationParams.limit) params.set(API_QUERY_PARAMS.LIMIT, paginationParams.limit);
    if (paginationParams.skip) params.set('skip', paginationParams.skip);

    // Add non-pagination filters from store
    Object.entries(filters).forEach(([key, value]) => {
      if (
        key !== API_QUERY_PARAMS.PAGE &&
        key !== API_QUERY_PARAMS.LIMIT &&
        key !== 'skip' &&
        key !== 'limit' &&
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        params.set(key, String(value));
      }
    });

    const newParamsString = params.toString();
    const currentParamsString = searchParams.toString();

    if (newParamsString !== currentParamsString) {
      console.log('Cards mode: syncing filters to URL');
      router.replace(`${pathname}?${newParamsString}`, { scroll: false });
    }
  }, [filters, pathname, router, mode, searchParams]);

  return { filters };
}
