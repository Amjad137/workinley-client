'use client';

import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { parseISO, isValid } from 'date-fns';
import { IProject } from '@/dto/project.dto';
import { FormValues, getWeekInfoFromDate } from './schema';

interface WeekProjectSectionProps {
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  watch: UseFormWatch<FormValues>;
  activeProjects: IProject[];
}

export const WeekProjectSection = ({
  control,
  setValue,
  watch,
  activeProjects,
}: WeekProjectSectionProps) => {
  const currentWeekNumber = watch('weekNumber');
  const currentYear = watch('year');

  return (
    <section>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-semibold text-foreground uppercase tracking-wide'>
          Week Details
        </h3>
        <Badge variant='outline' className='text-xs font-mono font-medium'>
          Week {currentWeekNumber}, {currentYear}
        </Badge>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={control}
          name='weekStartDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Week Start *</FormLabel>
              <FormControl>
                <Input
                  type='date'
                  {...field}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                    if (val) {
                      const parsed = parseISO(val);
                      if (isValid(parsed)) {
                        const info = getWeekInfoFromDate(parsed);
                        setValue('weekEndDate', info.weekEndDate, { shouldValidate: true });
                        setValue('weekNumber', info.weekNumber, { shouldValidate: true });
                        setValue('year', info.year, { shouldValidate: true });
                      }
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='weekEndDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Week End *</FormLabel>
              <FormControl>
                <Input
                  type='date'
                  {...field}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                    if (val) {
                      const parsed = parseISO(val);
                      if (isValid(parsed)) {
                        const info = getWeekInfoFromDate(parsed);
                        setValue('weekNumber', info.weekNumber, { shouldValidate: true });
                        setValue('year', info.year, { shouldValidate: true });
                      }
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='mt-4'>
        <FormField
          control={control}
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
  );
};
