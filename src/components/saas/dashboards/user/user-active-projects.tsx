/* eslint-disable sonarjs/no-nested-conditional */
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes.constants';
import { IProject } from '@/dto/project.dto';
import { ArrowRight, FolderKanban, Layers } from 'lucide-react';
import Link from 'next/link';

interface UserActiveProjectsProps {
  projects: IProject[];
  isLoading: boolean;
}

export const UserActiveProjects = ({ projects, isLoading }: UserActiveProjectsProps) => {
  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className='flex flex-row items-center justify-between pb-3'>
        <div>
          <CardTitle className='text-base font-semibold'>Active Projects</CardTitle>
          <p className='text-xs text-muted-foreground mt-0.5'>
            Current company projects for task tracking
          </p>
        </div>
        <Button
          variant='ghost'
          size='sm'
          asChild
          className='text-xs font-medium text-primary hover:text-primary/80'
        >
          <Link href={ROUTES.PROJECTS_ROOT} className='gap-1'>
            All Projects <ArrowRight className='h-3 w-3' />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className='flex-1'>
        {isLoading ? (
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className='h-14 w-full rounded-lg' />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-10 text-center rounded-lg border border-dashed border-border/80 bg-muted/20'>
            <Layers className='h-10 w-10 text-muted-foreground/40 mb-2' />
            <p className='text-sm font-medium text-foreground'>No Projects Available</p>
            <p className='text-xs text-muted-foreground mt-0.5 max-w-xs'>
              No active projects are configured right now.
            </p>
          </div>
        ) : (
          <div className='space-y-2.5'>
            {projects.slice(0, 5).map((project) => (
              <div
                key={project.id}
                className='flex items-center justify-between gap-3 p-2.5 rounded-lg border border-border/70 hover:border-primary/40 hover:bg-muted/30 transition-all'
              >
                <div className='flex items-center gap-2.5 min-w-0'>
                  <div
                    className='h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ring-1 ring-border shadow-2xs'
                    style={{
                      backgroundColor: project.color ? `${project.color}15` : 'hsl(var(--muted))',
                    }}
                  >
                    <FolderKanban
                      className='h-4 w-4'
                      style={{ color: project.color || 'hsl(var(--primary))' }}
                    />
                  </div>
                  <div className='min-w-0'>
                    <div className='flex items-center gap-2'>
                      <span
                        className='font-medium text-sm text-foreground truncate'
                        title={project.name}
                      >
                        {project.name}
                      </span>
                    </div>
                    {project.description ? (
                      <p className='text-xs text-muted-foreground truncate max-w-xs'>
                        {project.description}
                      </p>
                    ) : (
                      <p className='text-xs text-muted-foreground/60 italic'>No description</p>
                    )}
                  </div>
                </div>

                <Badge
                  variant='outline'
                  className='font-mono text-[11px] shrink-0 border-border bg-muted/40'
                >
                  {project.code}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserActiveProjects;
