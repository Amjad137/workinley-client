'use client';

import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table/table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import {
  REPORT_STATUS,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_VARIANTS,
} from '@/constants/report.constants';
import { IWeeklyReport } from '@/dto/report.dto';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Hash } from 'lucide-react';
import ReviewActionsDropdown from './table-action-components/review-actions-dropdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const reviewsTableColumns: ColumnDef<IWeeklyReport>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'user',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Team Member' />,
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user) return <span className='text-xs text-muted-foreground'>-</span>;
      const displayName = user.name || user.email || 'Member';
      const initials =
        displayName
          .split(' ')
          .filter(Boolean)
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'U';
      return (
        <div className='flex items-center gap-2'>
          <Avatar className='h-7 w-7'>
            <AvatarImage src={user.image} />
            <AvatarFallback className='text-xs'>{initials}</AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <p className='text-xs font-medium truncate'>{user.name || user.email}</p>
            {user.name && user.email && (
              <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'week',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Week' />,
    cell: ({ row }) => (
      <div className='flex items-center gap-1.5 text-xs'>
        <Hash size={12} className='text-muted-foreground' />
        <span className='font-semibold'>W{row.original.weekNumber}</span>
        <span className='text-muted-foreground'>/{row.original.year}</span>
      </div>
    ),
  },
  {
    accessorKey: 'project',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Project' />,
    cell: ({ row }) => {
      const project = row.original.project;
      if (!project) return <span className='text-xs text-muted-foreground'>-</span>;
      return (
        <div className='flex items-center gap-1.5'>
          <span
            className='inline-block w-2.5 h-2.5 rounded-full'
            style={{ backgroundColor: project.color }}
          />
          <span className='text-xs font-medium'>{project.code}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'tasks',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tasks' />,
    cell: ({ row }) => {
      const tasks = row.original.tasks ?? [];
      const done = tasks.filter((t) => t.status === 'COMPLETED').length;
      return (
        <span className='text-xs text-muted-foreground'>
          {done}/{tasks.length}
        </span>
      );
    },
  },
  {
    accessorKey: 'currentVersion',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Rev' />,
    cell: ({ row }) => (
      <span className='text-xs text-muted-foreground'>v{row.original.currentVersion}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = row.original.status as REPORT_STATUS;
      return (
        <Badge
          variant={REPORT_STATUS_VARIANTS[status]}
          className='w-32 justify-center text-center text-xs font-medium'
        >
          {REPORT_STATUS_LABELS[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'submittedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Submitted' />,
    cell: ({ row }) => {
      if (!row.original.submittedAt)
        return <span className='text-xs text-muted-foreground'>-</span>;
      return (
        <span className='text-xs text-muted-foreground'>
          {format(new Date(row.original.submittedAt), 'MMM d, HH:mm')}
        </span>
      );
    },
  },
  {
    accessorKey: 'selectedRowsAndActions',
    header: ({ table }) => {
      const n = table.getSelectedRowModel().rows.length;
      return (
        <div className='flex items-center w-full gap-2'>
          <span className='flex justify-end text-muted-foreground w-full text-xs text-end'>
            {n} Selected
          </span>
        </div>
      );
    },
    cell: ({ row }) => <ReviewActionsDropdown rowData={row.original} />,
  },
];
