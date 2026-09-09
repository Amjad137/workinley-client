import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/data-table/table-column-header';
import { PROJECT_STATUS } from '@/constants/project.constants';
import { IProject } from '@/dto/project.dto';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import ProjectActionsDropdown from './table-action-components/project-actions-dropdown';

export const projectsTableColumns: ColumnDef<IProject>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Project Name' />,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <span
          className='inline-block w-3 h-3 rounded-full flex-shrink-0'
          style={{ backgroundColor: row.original.color }}
        />
        <span className='font-medium text-xs text-foreground'>{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Code' />,
    cell: ({ row }) => (
      <span className='font-mono text-xs bg-muted px-2 py-0.5 rounded'>{row.original.code}</span>
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Description' />,
    cell: ({ row }) => (
      <span className='text-xs text-muted-foreground line-clamp-1 max-w-[200px]'>
        {row.original.description ?? '-'}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const isActive = row.original.status === PROJECT_STATUS.ACTIVE;
      return (
        <Badge variant={isActive ? 'default' : 'secondary'} className='text-xs'>
          {isActive ? 'Active' : 'Archived'}
        </Badge>
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
    cell: ({ row }) => <ProjectActionsDropdown rowData={row.original} />,
  },
];
