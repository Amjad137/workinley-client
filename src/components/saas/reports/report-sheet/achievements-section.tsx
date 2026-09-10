'use client';

import { Control, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Trophy, Plus, Trash2 } from 'lucide-react';
import { FormValues } from './schema';

interface AchievementsSectionProps {
  control: Control<FormValues>;
}

export const AchievementsSection = ({ control }: AchievementsSectionProps) => {
  const {
    fields: achievementFields,
    append: addAchievement,
    remove: removeAchievement,
  } = useFieldArray({ control, name: 'achievements' });

  return (
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
                control={control}
                name={`achievements.${idx}.description`}
                render={({ field: inputField }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input placeholder='What did you accomplish?' {...inputField} />
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
              control={control}
              name={`achievements.${idx}.isKeyAchievement`}
              render={({ field: inputField }) => (
                <FormItem className='flex items-center gap-2'>
                  <FormControl>
                    <Switch checked={inputField.value} onCheckedChange={inputField.onChange} />
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
  );
};
