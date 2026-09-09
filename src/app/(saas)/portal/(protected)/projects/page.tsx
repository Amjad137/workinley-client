'use client';

import { useState } from 'react';
import CreateProjectDialog from '@/components/saas/projects/table-action-components/create-project-dialog';
import ProjectsFilterComponents from '@/components/saas/projects/projects-filter-components';
import { projectsTableColumns } from '@/components/saas/projects/projects-table-columns';
import PageLoader from '@/components/saas/shared/page-loader';
import { DataTable } from '@/components/ui/data-table/data-table';
import { API_QUERY_PARAMS, ENTITY_SORT, SORT_BY } from '@/constants/common.constants';
import { PROJECT_QUERY_PARAMS, PROJECT_STATUS } from '@/constants/project.constants';
import { IProjectQuery } from '@/dto/project.dto';
import { useTableUrlSync } from '@/hooks/use-table-url-sync';
import { useGetAllProjects } from '@/hooks/use-projects';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const ProjectsPage = () => {
  const searchParams = useSearchParams();
  useTableUrlSync();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  const queryParams: IProjectQuery = {
    search: searchParams.get(API_QUERY_PARAMS.SEARCH) ?? undefined,
    sortBy: (searchParams.get(API_QUERY_PARAMS.SORT_BY) as SORT_BY) ?? SORT_BY.DATE,
    sortOrder: (searchParams.get(API_QUERY_PARAMS.SORT_ORDER) as ENTITY_SORT) ?? ENTITY_SORT.DESC,
    page: searchParams.get(API_QUERY_PARAMS.PAGE)
      ? Number(searchParams.get(API_QUERY_PARAMS.PAGE))
      : 1,
    limit: searchParams.get(API_QUERY_PARAMS.LIMIT)
      ? Number(searchParams.get(API_QUERY_PARAMS.LIMIT))
      : 20,
    status: (searchParams.get(PROJECT_QUERY_PARAMS.STATUS) as PROJECT_STATUS) ?? undefined,
  };

  const { data: projects, pagination, isLoading } = useGetAllProjects(queryParams);

  if (isLoading) return <PageLoader />;

  return (
    <div className='container mx-auto flex h-full w-full gap-2 flex-col justify-start'>
      <DataTable
        columns={projectsTableColumns}
        data={projects || []}
        pagination={pagination}
        filterComponents={<ProjectsFilterComponents />}
        actionComponents={() => (
          <div className='flex items-center gap-2'>
            <Button size='sm' onClick={() => setOpenCreateDialog(true)} id='create-project-btn'>
              <Plus className='mr-1 h-4 w-4' /> New Project
            </Button>
          </div>
        )}
      />

      {openCreateDialog && (
        <CreateProjectDialog open={openCreateDialog} setOpen={setOpenCreateDialog} />
      )}
    </div>
  );
};

export default ProjectsPage;
