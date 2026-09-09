'use client';

import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import CreateInvitationDialog from './create-invitation-dialog';

const InvitationActionComponents = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='flex items-center gap-3'>
      <Button onClick={() => setIsOpen(true)} className='flex items-center gap-2'>
        <UserPlus className='h-4 w-4' />
        <span>Invite User</span>
      </Button>

      <CreateInvitationDialog open={isOpen} setOpen={setIsOpen} />
    </div>
  );
};

export default InvitationActionComponents;
