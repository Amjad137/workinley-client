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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { TASK_PRIORITY } from '@/constants/report.constants';
import { FormValues } from './schema';

interface PlansNotesSectionProps {
  control: Control<FormValues>;
}

export const PlansNotesSection = ({ control }: PlansNotesSectionProps) => {
  const {
    fields: plannedTaskFields,
    append: addPlannedTask,
    remove: removePlannedTask,
  } = useFieldArray({ control, name: 'plannedTasks' });

  return (
    <section className='space-y-6'>
      <div>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-sm font-semibold uppercase tracking-wide'>
            Next Week Planned Tasks ({plannedTaskFields.length})
          </h3>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() =>
              addPlannedTask({
                name: '',
                priority: TASK_PRIORITY.MEDIUM,
                plannedHours: 0,
                projectId: '',
              })
            }
          >
            <Plus size={14} className='mr-1' /> Add Planned Task
          </Button>
        </div>

        {plannedTaskFields.length === 0 && (
          <p className='text-xs text-muted-foreground text-center py-4 border border-dashed rounded-md'>
            No planned tasks yet. Click &quot;Add Planned Task&quot; to plan for next week.
          </p>
        )}

        <div className='space-y-3'>
          {plannedTaskFields.map((field, idx) => (
            <div
              key={field.id}
              className='border border-border rounded-lg p-3 space-y-3 bg-muted/20 relative'
            >
              <div className='flex items-start justify-between gap-2'>
                <span className='text-xs font-semibold text-muted-foreground pt-0.5'>
                  Planned Task #{idx + 1}
                </span>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6 text-destructive hover:text-destructive'
                  onClick={() => removePlannedTask(idx)}
                >
                  <Trash2 size={12} />
                </Button>
              </div>

              <FormField
                control={control}
                name={`plannedTasks.${idx}.name`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel className='text-xs'>Plan Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. Complete checkout workflow' {...inputField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-3'>
                <FormField
                  control={control}
                  name={`plannedTasks.${idx}.priority`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel className='text-xs'>Priority</FormLabel>
                      <Select
                        onValueChange={inputField.onChange}
                        defaultValue={inputField.value ?? TASK_PRIORITY.MEDIUM}
                      >
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`plannedTasks.${idx}.plannedHours`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel className='text-xs'>Estimated Hours</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={0}
                          step={0.5}
                          placeholder='0'
                          {...inputField}
                          onChange={(e) => inputField.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <FormField
          control={control}
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
  );
};
