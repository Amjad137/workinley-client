import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IProject } from '@/dto/project.dto';
import { useArchiveProject } from '@/hooks/use-projects';
import { PROJECT_STATUS } from '@/constants/project.constants';
import { Archive, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EditProjectDialog from './edit-project-dialog';
import DeleteProjectDialog from './delete-project-dialog';

type Props = {
  rowData: IProject;
};

const ProjectActionsDropdown = ({ rowData }: Props) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const { mutateAsync: archive, isPending: isArchiving } = useArchiveProject();

  const openEdit = () => {
    setOpenDropdown(false);
    setOpenEditDialog(true);
  };

  const openDelete = () => {
    setOpenDropdown(false);
    setOpenDeleteDialog(true);
  };

  const handleArchive = async () => {
    setOpenDropdown(false);
    await archive(rowData.id);
  };

  return (
    <>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger className='items-right w-full' asChild>
          <MoreVertical size={15} className='cursor-pointer' />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mr-7' align='start'>
          <DropdownMenuItem onClick={openEdit}>
            <Pencil className='mr-2 h-4 w-4' /> Edit
          </DropdownMenuItem>
          {rowData.status === PROJECT_STATUS.ACTIVE && (
            <DropdownMenuItem onClick={handleArchive} disabled={isArchiving}>
              <Archive className='mr-2 h-4 w-4' /> Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openDelete} className='text-destructive'>
            <Trash2 className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {openEditDialog && (
        <EditProjectDialog open={openEditDialog} setOpen={setOpenEditDialog} project={rowData} />
      )}

      {openDeleteDialog && (
        <DeleteProjectDialog
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          projectId={rowData.id}
          projectName={rowData.name}
        />
      )}
    </>
  );
};

export default ProjectActionsDropdown;
