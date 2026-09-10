'use client';

import { Control, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { FormValues } from './schema';

interface BlockersSectionProps {
  control: Control<FormValues>;
}

export const BlockersSection = ({ control }: BlockersSectionProps) => {
  const {
    fields: blockerFields,
    append: addBlocker,
    remove: removeBlocker,
  } = useFieldArray({ control, name: 'blockers' });

  return (
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
                control={control}
                name={`blockers.${idx}.description`}
                render={({ field: inputField }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input placeholder='Describe the blocker...' {...inputField} />
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
              control={control}
              name={`blockers.${idx}.isKeyBlocker`}
              render={({ field: inputField }) => (
                <FormItem className='flex items-center gap-2'>
                  <FormControl>
                    <Switch checked={inputField.value} onCheckedChange={inputField.onChange} />
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
  );
};
