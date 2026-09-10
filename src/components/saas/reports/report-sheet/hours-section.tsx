'use client';

import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';
import { FormValues } from './schema';

interface HoursSectionProps {
  control: Control<FormValues>;
}

const CATEGORIES = ['development', 'testing', 'meetings', 'documentation', 'other'] as const;

export const HoursSection = ({ control }: HoursSectionProps) => {
  return (
    <section>
      <h3 className='text-sm font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-3'>
        <Clock size={14} className='text-blue-400' />
        Hours Breakdown
      </h3>
      <div className='grid grid-cols-3 gap-3'>
        {CATEGORIES.map((category) => (
          <FormField
            key={category}
            control={control}
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
        ))}
      </div>
    </section>
  );
};
