'use client';

import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { FormValues } from './schema';

interface PlansNotesSectionProps {
  control: Control<FormValues>;
}

export const PlansNotesSection = ({ control }: PlansNotesSectionProps) => {
  return (
    <section>
      <h3 className='text-sm font-semibold uppercase tracking-wide mb-3'>Next Week Plans</h3>
      <FormField
        control={control}
        name='nextWeekPlans'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea placeholder={'- Plan a\n- Plan b\n- Plan c'} rows={4} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='mt-4'>
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
