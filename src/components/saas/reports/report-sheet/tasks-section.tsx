'use client';

import { Control, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { TASK_PRIORITY, TASK_STATUS } from '@/constants/report.constants';
import { FormValues } from './schema';

interface TasksSectionProps {
  control: Control<FormValues>;
}

export const TasksSection = ({ control }: TasksSectionProps) => {
  const {
    fields: taskFields,
    append: addTask,
    remove: removeTask,
  } = useFieldArray({ control, name: 'tasks' });

  return (
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
          No tasks yet. Click &quot;Add Task&quot; to add your first task.
        </p>
      )}

      <div className='space-y-4'>
        {taskFields.map((field, idx) => (
          <div key={field.id} className='border border-border rounded-lg p-4 space-y-3 relative'>
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
              control={control}
              name={`tasks.${idx}.name`}
              render={({ field: inputField }) => (
                <FormItem>
                  <FormLabel className='text-xs'>Task Name *</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. Implement login API' {...inputField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={control}
                name={`tasks.${idx}.priority`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>Priority</FormLabel>
                    <Select onValueChange={inputField.onChange} defaultValue={inputField.value}>
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
                control={control}
                name={`tasks.${idx}.status`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>Status</FormLabel>
                    <Select onValueChange={inputField.onChange} defaultValue={inputField.value}>
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
                control={control}
                name={`tasks.${idx}.plannedPercent`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>Planned %</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
                        max={100}
                        {...inputField}
                        onChange={(e) => inputField.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`tasks.${idx}.actualPercent`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>Actual %</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
                        max={100}
                        {...inputField}
                        onChange={(e) => inputField.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={control}
                name={`tasks.${idx}.plannedHours`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>Planned Hrs</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.5'
                        min={0}
                        {...inputField}
                        onChange={(e) => inputField.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`tasks.${idx}.spentHours`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>Spent Hrs</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.5'
                        min={0}
                        {...inputField}
                        onChange={(e) => inputField.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name={`tasks.${idx}.deliverable`}
              render={({ field: inputField }) => (
                <FormItem>
                  <FormLabel className='text-xs'>Deliverable / PR Link</FormLabel>
                  <FormControl>
                    <Input placeholder='https://github.com/...' {...inputField} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
