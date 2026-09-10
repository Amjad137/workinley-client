'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { PROJECT_STATUS } from '@/constants/project.constants';
import { IProject } from '@/dto/project.dto';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Archive, Calendar, CheckCircle2, FolderGit2 } from 'lucide-react';

interface ProjectMemberCardProps {
  project: IProject;
}

export const ProjectMemberCard = ({ project }: ProjectMemberCardProps) => {
  const isActive = project.status === PROJECT_STATUS.ACTIVE;

  return (
    <Card className='flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/40 group'>
      <CardHeader className='pb-3 pt-5 px-5'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3 min-w-0'>
            <div
              className='h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-border shadow-xs'
              style={{
                backgroundColor: project.color ? `${project.color}20` : 'hsl(var(--muted))',
                borderColor: project.color ? `${project.color}40` : 'hsl(var(--border))',
              }}
            >
              <FolderGit2
                className='h-5 w-5'
                style={{ color: project.color || 'hsl(var(--primary))' }}
              />
            </div>
            <div className='min-w-0 flex-1'>
              <h3
                className='font-semibold text-foreground text-base truncate group-hover:text-primary transition-colors'
                title={project.name}
              >
                {project.name}
              </h3>
              <div className='flex items-center gap-2 mt-0.5'>
                <Badge
                  variant='outline'
                  className='text-[11px] font-mono font-medium px-1.5 py-0 border-border bg-muted/30 text-muted-foreground'
                >
                  {project.code}
                </Badge>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0',
              isActive
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-muted text-muted-foreground border-border',
            )}
          >
            {isActive ? <CheckCircle2 className='h-3 w-3' /> : <Archive className='h-3 w-3' />}
            <span>{isActive ? 'Active' : 'Archived'}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className='py-2 px-5 flex-1'>
        <p className='text-xs text-muted-foreground line-clamp-3 leading-relaxed min-h-[3rem]'>
          {project.description || 'No description provided for this project.'}
        </p>
      </CardContent>

      <CardFooter className='pt-3 pb-4 px-5 border-t border-border/50 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground'>
        <div className='flex items-center gap-1.5'>
          <Calendar className='h-3.5 w-3.5 text-muted-foreground/70' />
          <span>Created {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
        </div>

        <div className='flex items-center gap-1.5'>
          <span
            className='h-2.5 w-2.5 rounded-full ring-1 ring-border shrink-0'
            style={{ backgroundColor: project.color || 'hsl(var(--primary))' }}
          />
          <span className='font-mono text-[11px] uppercase'>{project.color || 'default'}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectMemberCard;
