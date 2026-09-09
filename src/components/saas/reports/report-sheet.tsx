'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useCreateReport, useUpdateReport } from '@/hooks/use-reports';
import { useGetActiveProjects } from '@/hooks/use-projects';
import { IWeeklyReport } from '@/dto/report.dto';
import { TASK_PRIORITY, TASK_STATUS } from '@/constants/report.constants';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { Loader2, Plus, Trash2, ClipboardList, AlertTriangle, Trophy, Clock } from 'lucide-react';
import { format, startOfWeek, endOfWeek, getISOWeek } from 'date-fns';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// ─── Yup Schema ──────────────────────────────────────────────────────────────

const taskSchema = yup.object({
  name: yup.string().required('Task name is required').max(300),
  priority: yup.mixed<TASK_PRIORITY>().oneOf(Object.values(TASK_PRIORITY)).optional(),
  plannedPercent: yup.number().min(0).max(100).optional(),
  actualPercent: yup.number().min(0).max(100).optional(),
  plannedCompletionPercent: yup.number().min(0).max(100).optional(),
  actualCompletionPercent: yup.number().min(0).max(100).optional(),
  status: yup.mixed<TASK_STATUS>().oneOf(Object.values(TASK_STATUS)).optional(),
  plannedHours: yup.number().min(0).optional(),
  spentHours: yup.number().min(0).optional(),
  actualHours: yup.number().min(0).optional(),
  deliverable: yup.string().optional().max(500),
  projectId: yup.string().optional(),
});

const blockerSchema = yup.object({
  description: yup.string().required('Description is required').max(500),
  isKeyBlocker: yup.boolean().optional(),
  isKeyIssue: yup.boolean().optional(),
});

const achievementSchema = yup.object({
  description: yup.string().required('Description is required').max(500),
  isKeyAchievement: yup.boolean().optional(),
});

const hoursBreakdownSchema = yup.object({
  development: yup.number().min(0).default(0),
  testing: yup.number().min(0).default(0),
  meetings: yup.number().min(0).default(0),
  documentation: yup.number().min(0).default(0),
  other: yup.number().min(0).default(0),
});

const schema = yup.object({
  weekStartDate: yup.string().required(),
  weekEndDate: yup.string().required(),
  weekNumber: yup.number().required(),
  year: yup.number().required(),
  projectId: yup.string().optional(),
  tasks: yup.array(taskSchema).defined().default([]),
  blockers: yup.array(blockerSchema).defined().default([]),
  achievements: yup.array(achievementSchema).defined().default([]),
  nextWeekPlans: yup.string().optional().max(3000),
  hoursBreakdown: hoursBreakdownSchema.optional(),
  notes: yup.string().optional().max(3000),
});

type FormValues = yup.InferType<typeof schema>;

// ─── Helper: get current week ─────────────────────────────────────────────────

function getCurrentWeekDefaults() {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });
  return {
    weekStartDate: format(start, 'yyyy-MM-dd'),
    weekEndDate: format(end, 'yyyy-MM-dd'),
    weekNumber: getISOWeek(now),
    year: now.getFullYear(),
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  report?: IWeeklyReport | null; // if provided → edit mode
};

// ─── Component ────────────────────────────────────────────────────────────────

const ReportSheet = ({ open, setOpen, report }: Props) => {
  const isEditMode = !!report;
  const { mutateAsync: create, isPending: isCreating } = useCreateReport();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateReport();
  const { data: activeProjects = [] } = useGetActiveProjects();

  const weekDefaults = getCurrentWeekDefaults();

  const defaultValues: FormValues = {
    weekStartDate: report?.weekStartDate
      ? format(new Date(report.weekStartDate), 'yyyy-MM-dd')
      : weekDefaults.weekStartDate,
    weekEndDate: report?.weekEndDate
      ? format(new Date(report.weekEndDate), 'yyyy-MM-dd')
      : weekDefaults.weekEndDate,
    weekNumber: report?.weekNumber ?? weekDefaults.weekNumber,
    year: report?.year ?? weekDefaults.year,
    projectId: report?.projectId ?? '',
    tasks: (report?.tasks ?? []).map((t) => ({
      name: t.name,
      priority: t.priority,
      plannedPercent: t.plannedPercent,
      actualPercent: t.actualPercent,
      status: t.status,
      plannedHours: t.plannedHours,
      spentHours: t.spentHours,
      deliverable: t.deliverable ?? '',
      projectId: t.projectId ?? '',
    })),
    blockers: (report?.blockers ?? []).map((b) => ({
      description: b.description,
      isKeyBlocker: b.isKeyBlocker,
    })),
    achievements: (report?.achievements ?? []).map((a) => ({
      description: a.description,
      isKeyAchievement: a.isKeyAchievement,
    })),
    nextWeekPlans: report?.nextWeekPlans ?? '',
    hoursBreakdown: report?.hoursBreakdown ?? {
      development: 0,
      testing: 0,
      meetings: 0,
      documentation: 0,
      other: 0,
    },
    notes: report?.notes ?? '',
  };

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (open) form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, report]);

  // Field arrays
  const {
    fields: taskFields,
    append: addTask,
    remove: removeTask,
  } = useFieldArray({ control: form.control, name: 'tasks' });

  const {
    fields: blockerFields,
    append: addBlocker,
    remove: removeBlocker,
  } = useFieldArray({ control: form.control, name: 'blockers' });

  const {
    fields: achievementFields,
    append: addAchievement,
    remove: removeAchievement,
  } = useFieldArray({ control: form.control, name: 'achievements' });

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditMode && report) {
        await update({ id: report.id, data: values });
        toast({ title: 'Saved', description: 'Report updated successfully' });
      } else {
        await create(values);
        toast({ title: 'Created', description: 'Report draft created' });
      }
      setOpen(false);
    } catch {
      // Error already handled by service
    }
  };

  const isPending = isCreating || isUpdating;
  const weekLabel = `Week ${form.watch('weekNumber')} / ${form.watch('year')}`;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side='right' className='w-full sm:max-w-2xl overflow-y-auto p-0 flex flex-col'>
        {/* Fixed Header */}
        <SheetHeader className='px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10'>
          <SheetTitle className='flex items-center gap-2'>
            <ClipboardList size={18} />
            {isEditMode ? 'Edit Report' : 'New Weekly Report'}
            <Badge variant='secondary' className='text-xs'>
              {weekLabel}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            {isEditMode ? 'Update your weekly report details' : 'Create a new weekly status report'}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Body */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 overflow-y-auto'>
            <div className='px-6 py-4 space-y-8'>
              {/* ── Section 1: Week & Project ─────────────────────────────── */}
              <section>
                <h3 className='text-sm font-semibold text-foreground mb-3 uppercase tracking-wide'>
                  Week Details
                </h3>
                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='weekStartDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Week Start *</FormLabel>
                        <FormControl>
                          <Input type='date' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='weekEndDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Week End *</FormLabel>
                        <FormControl>
                          <Input type='date' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='mt-4'>
                  <FormField
                    control={form.control}
                    name='projectId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Project</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a project (optional)' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {activeProjects.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                <div className='flex items-center gap-2'>
                                  <span
                                    className='inline-block w-2 h-2 rounded-full'
                                    style={{ backgroundColor: p.color }}
                                  />
                                  {p.name} ({p.code})
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <Separator />

              {/* ── Section 2: Tasks ─────────────────────────────────────── */}
              <section>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-sm font-semibold uppercase tracking-wide'>
                    Tasks ({taskFields.length})
                  </h3>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      addTask({
                        name: '',
                        priority: TASK_PRIORITY.MEDIUM,
                        plannedPercent: 0,
                        actualPercent: 0,
                        status: TASK_STATUS.IN_PROGRESS,
                        plannedHours: 0,
                        spentHours: 0,
                        deliverable: '',
                        projectId: '',
                      })
                    }
                  >
                    <Plus size={14} className='mr-1' /> Add Task
                  </Button>
                </div>

                {taskFields.length === 0 && (
                  <p className='text-xs text-muted-foreground text-center py-4 border border-dashed rounded-md'>
                    No tasks yet. Click "Add Task" to add your first task.
                  </p>
                )}

                <div className='space-y-4'>
                  {taskFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className='border border-border rounded-lg p-4 space-y-3 relative'
                    >
                      <div className='flex items-start justify-between gap-2'>
                        <span className='text-xs font-semibold text-muted-foreground pt-0.5'>
                          Task #{idx + 1}
                        </span>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6 text-destructive hover:text-destructive'
                          onClick={() => removeTask(idx)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>

                      <FormField
                        control={form.control}
                        name={`tasks.${idx}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>Task Name *</FormLabel>
                            <FormControl>
                              <Input placeholder='e.g. Implement login API' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='grid grid-cols-2 gap-3'>
                        <FormField
                          control={form.control}
                          name={`tasks.${idx}.priority`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-xs'>Priority</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className='text-xs'>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(TASK_PRIORITY).map((p) => (
                                    <SelectItem key={p} value={p} className='text-xs'>
                                      {p}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`tasks.${idx}.status`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-xs'>Status</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className='text-xs'>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(TASK_STATUS).map((s) => (
                                    <SelectItem key={s} value={s} className='text-xs'>
                                      {s.replace('_', ' ')}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className='grid grid-cols-2 gap-3'>
                        <FormField
                          control={form.control}
                          name={`tasks.${idx}.plannedPercent`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-xs'>Planned %</FormLabel>
                              <FormControl>
                                <Input
                                  type='number'
                                  min={0}
                                  max={100}
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`tasks.${idx}.actualPercent`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-xs'>Actual %</FormLabel>
                              <FormControl>
                                <Input
                                  type='number'
                                  min={0}
                                  max={100}
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className='grid grid-cols-2 gap-3'>
                        <FormField
                          control={form.control}
                          name={`tasks.${idx}.plannedHours`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-xs'>Planned Hrs</FormLabel>
                              <FormControl>
                                <Input
                                  type='number'
                                  step='0.5'
                                  min={0}
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`tasks.${idx}.spentHours`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-xs'>Spent Hrs</FormLabel>
                              <FormControl>
                                <Input
                                  type='number'
                                  step='0.5'
                                  min={0}
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`tasks.${idx}.deliverable`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs'>Deliverable / PR Link</FormLabel>
                            <FormControl>
                              <Input placeholder='https://github.com/...' {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              {/* ── Section 3: Blockers ───────────────────────────────────── */}
              <section>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-sm font-semibold uppercase tracking-wide flex items-center gap-1.5'>
                    <AlertTriangle size={14} className='text-orange-400' />
                    Blockers ({blockerFields.length})
                  </h3>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => addBlocker({ description: '', isKeyBlocker: false })}
                  >
                    <Plus size={14} className='mr-1' /> Add
                  </Button>
                </div>

                <div className='space-y-3'>
                  {blockerFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className='border border-orange-200 dark:border-orange-900/40 rounded-lg p-3 space-y-2'
                    >
                      <div className='flex items-start gap-2'>
                        <FormField
                          control={form.control}
                          name={`blockers.${idx}.description`}
                          render={({ field }) => (
                            <FormItem className='flex-1'>
                              <FormControl>
                                <Input placeholder='Describe the blocker...' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='h-9 w-9 text-destructive'
                          onClick={() => removeBlocker(idx)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name={`blockers.${idx}.isKeyBlocker`}
                        render={({ field }) => (
                          <FormItem className='flex items-center gap-2'>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className='text-xs cursor-pointer !mt-0'>
                              Key blocker of the week
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}

                  {blockerFields.length === 0 && (
                    <p className='text-xs text-muted-foreground text-center py-3 border border-dashed rounded-md'>
                      No blockers - great week! 🎉
                    </p>
                  )}
                </div>
              </section>

              <Separator />

              {/* ── Section 4: Achievements ───────────────────────────────── */}
              <section>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-sm font-semibold uppercase tracking-wide flex items-center gap-1.5'>
                    <Trophy size={14} className='text-yellow-500' />
                    Achievements ({achievementFields.length})
                  </h3>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => addAchievement({ description: '', isKeyAchievement: false })}
                  >
                    <Plus size={14} className='mr-1' /> Add
                  </Button>
                </div>

                <div className='space-y-3'>
                  {achievementFields.map((field, idx) => (
                    <div
                      key={field.id}
                      className='border border-yellow-200 dark:border-yellow-900/40 rounded-lg p-3 space-y-2'
                    >
                      <div className='flex items-start gap-2'>
                        <FormField
                          control={form.control}
                          name={`achievements.${idx}.description`}
                          render={({ field }) => (
                            <FormItem className='flex-1'>
                              <FormControl>
                                <Input placeholder='What did you accomplish?' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='h-9 w-9 text-destructive'
                          onClick={() => removeAchievement(idx)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name={`achievements.${idx}.isKeyAchievement`}
                        render={({ field }) => (
                          <FormItem className='flex items-center gap-2'>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className='text-xs cursor-pointer !mt-0'>
                              Key achievement of the week
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}

                  {achievementFields.length === 0 && (
                    <p className='text-xs text-muted-foreground text-center py-3 border border-dashed rounded-md'>
                      Add your wins for this week
                    </p>
                  )}
                </div>
              </section>

              <Separator />

              {/* ── Section 5: Hours Breakdown ────────────────────────────── */}
              <section>
                <h3 className='text-sm font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-3'>
                  <Clock size={14} className='text-blue-400' />
                  Hours Breakdown
                </h3>
                <div className='grid grid-cols-3 gap-3'>
                  {(['development', 'testing', 'meetings', 'documentation', 'other'] as const).map(
                    (category) => (
                      <FormField
                        key={category}
                        control={form.control}
                        name={`hoursBreakdown.${category}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-xs capitalize'>{category}</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                step='0.5'
                                min={0}
                                placeholder='0'
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ),
                  )}
                </div>
              </section>

              <Separator />

              {/* ── Section 6: Plans & Notes ──────────────────────────────── */}
              <section>
                <h3 className='text-sm font-semibold uppercase tracking-wide mb-3'>
                  Next Week Plans
                </h3>
                <FormField
                  control={form.control}
                  name='nextWeekPlans'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder='- Plan a&#10;- Plan b&#10;- Plan c'
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='mt-4'>
                  <FormField
                    control={form.control}
                    name='notes'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Any links, references, or extra context...'
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>
            </div>

            {/* ── Fixed Footer ─────────────────────────────────────────────── */}
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
