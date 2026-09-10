'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ClipboardList, Loader2 } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { useCreateReport, useUpdateReport, useGetReportById } from '@/hooks/use-reports';
import { useGetActiveProjects } from '@/hooks/use-projects';
import { toast } from '@/hooks/use-toast';
import { IWeeklyReport } from '@/dto/report.dto';

import {
  reportSchema,
  FormValues,
  buildInitialFormValues,
  WeekProjectSection,
  TasksSection,
  BlockersSection,
  AchievementsSection,
  HoursSection,
  PlansNotesSection,
} from './report-sheet/index';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  report?: IWeeklyReport | null;
};

const ReportSheet = ({ open, setOpen, report }: Props) => {
  const isEditMode = !!report;
  const { mutateAsync: create, isPending: isCreating } = useCreateReport();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateReport();
  const { data: activeProjects = [] } = useGetActiveProjects();

  const { data: fetchedReport, isLoading: isFetchingReport } = useGetReportById(report?.id ?? '', {
    enabled: open && !!report?.id,
  });

  const activeReport = fetchedReport ?? report;

  const form = useForm<FormValues>({
    resolver: yupResolver(reportSchema),
    defaultValues: buildInitialFormValues(activeReport),
  });

  useEffect(() => {
    if (open) {
      form.reset(buildInitialFormValues(activeReport));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeReport]);

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        ...values,
        projectId: values.projectId || undefined,
        tasks: values.tasks?.map((t) => ({
          ...t,
          projectId: t.projectId || values.projectId || undefined,
        })),
        plannedTasks: values.plannedTasks?.map((pt, i) => ({
          ...pt,
          projectId: pt.projectId || values.projectId || undefined,
          orderIndex: i,
        })),
        nextWeekPlans: values.plannedTasks?.map((pt) => `- ${pt.name}`).join('\n'),
      };

      if (isEditMode && report) {
        await update({ id: report.id, data: payload });
        toast({ title: 'Saved', description: 'Report updated successfully' });
      } else {
        await create(payload);
        toast({ title: 'Created', description: 'Report draft created' });
      }
      setOpen(false);
    } catch {
      // Error handled by service toast
    }
  };

  const isPending = isCreating || isUpdating;
  const weekLabel = `Week ${form.watch('weekNumber')} / ${form.watch('year')}`;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side='right' className='w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col'>
        {/* Header */}
        <SheetHeader className='px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10'>
          <SheetTitle className='flex items-center gap-2'>
            <ClipboardList size={18} />
            {isEditMode ? 'Edit Report' : 'New Weekly Report'}
            <Badge variant='secondary' className='text-xs'>
              {weekLabel}
            </Badge>
            {isFetchingReport && (
              <span className='inline-flex items-center gap-1 text-xs font-normal text-muted-foreground ml-1'>
                <Loader2 className='h-3.5 w-3.5 animate-spin' /> Loading details...
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            {isEditMode ? 'Update your weekly report details' : 'Create a new weekly status report'}
          </SheetDescription>
        </SheetHeader>

        {/* Form Body */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 overflow-y-auto'>
            <div className='px-6 py-4 space-y-8'>
              {/* Week & Project Section */}
              <WeekProjectSection
                control={form.control}
                setValue={form.setValue}
                watch={form.watch}
                activeProjects={activeProjects}
              />

              <Separator />

              {/* Tasks Section */}
              <TasksSection control={form.control} />

              <Separator />

              {/* Blockers Section */}
              <BlockersSection control={form.control} />

              <Separator />

              {/* Achievements Section */}
              <AchievementsSection control={form.control} />

              <Separator />

              {/* Hours Breakdown Section */}
              <HoursSection control={form.control} />

              <Separator />

              {/* Plans & Notes Section */}
              <PlansNotesSection control={form.control} />
            </div>

            {/* Footer Actions */}
            <div className='sticky bottom-0 bg-background border-t px-6 py-4 flex justify-end gap-3'>
              <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {isEditMode ? 'Save Changes' : 'Save Draft'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default ReportSheet;
