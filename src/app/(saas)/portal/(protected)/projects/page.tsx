'use client';

import ProjectMemberCard from '@/components/saas/projects/project-member-card';
import ProjectsFilterComponents from '@/components/saas/projects/projects-filter-components';
import { PaginationWithLinks } from '@/components/ui/data-table/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { API_QUERY_PARAMS, ENTITY_SORT, SORT_BY } from '@/constants/common.constants';
import { PROJECT_QUERY_PARAMS, PROJECT_STATUS } from '@/constants/project.constants';
import { IProjectQuery } from '@/dto/project.dto';
import { useGetAllProjects } from '@/hooks/use-projects';
import { useTableUrlSync } from '@/hooks/use-table-url-sync';
import { Inbox } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const ProjectsPage = () => {
  const searchParams = useSearchParams();

  // Initialize URL sync for cards mode
  useTableUrlSync('cards');

  const queryParams: IProjectQuery = {
    search: searchParams.get(API_QUERY_PARAMS.SEARCH) ?? undefined,
    sortBy: (searchParams.get(API_QUERY_PARAMS.SORT_BY) as SORT_BY) ?? SORT_BY.DATE,
    sortOrder: (searchParams.get(API_QUERY_PARAMS.SORT_ORDER) as ENTITY_SORT) ?? ENTITY_SORT.DESC,
    page: searchParams.get(API_QUERY_PARAMS.PAGE)
      ? Number(searchParams.get(API_QUERY_PARAMS.PAGE))
      : 1,
    limit: searchParams.get(API_QUERY_PARAMS.LIMIT)
      ? Number(searchParams.get(API_QUERY_PARAMS.LIMIT))
      : 12,
    status: (searchParams.get(PROJECT_QUERY_PARAMS.STATUS) as PROJECT_STATUS) ?? undefined,
  };

  const { data: projects, pagination, isLoading } = useGetAllProjects(queryParams);

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
            <Skeleton key={index} className='h-48 w-full rounded-xl' />
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
          <h1 className='text-2xl font-bold text-foreground'>Projects</h1>
          <p className='text-muted-foreground text-sm mt-1'>
            Browse and explore active company projects and task codes
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className='flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border border-border shadow-xs'>
        <ProjectsFilterComponents />
      </div>

      {/* Cards Grid */}
      {!projects || projects.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border bg-card/50'>
          <Inbox className='h-12 w-12 text-muted-foreground/40 mb-3' />
          <h3 className='font-semibold text-foreground text-lg'>No Projects Found</h3>
          <p className='text-sm text-muted-foreground mt-1 max-w-sm'>
            {queryParams.search || queryParams.status
              ? 'Try adjusting your search criteria or status filter.'
              : 'No projects currently available.'}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr'>
          {projects.map((project) => (
            <ProjectMemberCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && <PaginationWithLinks pagination={pagination} isTable={false} />}
    </div>
  );
};

export default ProjectsPage;
