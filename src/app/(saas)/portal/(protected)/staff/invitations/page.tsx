'use client';

import InvitationActionComponents from '@/components/saas/admin/invitations/invitation-action-components';
import InvitationCard from '@/components/saas/admin/invitations/invitation-card';
import InvitationFilterComponents from '@/components/saas/admin/invitations/invitation-filter-components';
import { PaginationWithLinks } from '@/components/ui/data-table/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { API_QUERY_PARAMS, ENTITY_SORT, SORT_BY } from '@/constants/common.constants';
import { USER_ROLE } from '@/constants/user.constants';
import { useGetAllUserInvitations } from '@/hooks/use-user-invitations';
import { useTableUrlSync } from '@/hooks/use-table-url-sync';
import { isAfter } from 'date-fns';
import { Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { IUserInvitationQuery } from '@/dto/user-invitation.dto';

const StaffInvitationsPage = () => {
  const searchParams = useSearchParams();
  useTableUrlSync('cards');

  const searchParam =
    searchParams?.get(API_QUERY_PARAMS.SEARCH) ?? searchParams?.get('search_key') ?? undefined;

  const queryParams: IUserInvitationQuery = {
    search: searchParam,
    search_key: searchParam,
    sortBy: (searchParams?.get(API_QUERY_PARAMS.SORT_BY) as SORT_BY) ?? SORT_BY.DATE,
    sortOrder: (searchParams?.get(API_QUERY_PARAMS.SORT_ORDER) as ENTITY_SORT) ?? ENTITY_SORT.DESC,
    page: searchParams?.get(API_QUERY_PARAMS.PAGE)
      ? Number(searchParams.get(API_QUERY_PARAMS.PAGE))
      : 1,
    limit: searchParams?.get(API_QUERY_PARAMS.LIMIT)
      ? Number(searchParams.get(API_QUERY_PARAMS.LIMIT))
      : 12,
    role: (searchParams?.get('role') as USER_ROLE) ?? undefined,
    status: searchParams?.get('status') ?? undefined,
  };

  const statusFilter = searchParams?.get('status') ?? undefined;

  const { isLoading, data: invitations, pagination } = useGetAllUserInvitations(queryParams);

  const filteredInvitations = (invitations || []).filter((inv) => {
    if (!statusFilter || statusFilter === 'ALL') return true;
    const now = new Date();
    const isExpired = !inv.isUsed && !isAfter(new Date(inv.expiresAt), now);
    const isPending = !inv.isUsed && !isExpired;

    if (statusFilter === 'PENDING') return isPending;
    if (statusFilter === 'USED') return inv.isUsed;
    if (statusFilter === 'EXPIRED') return isExpired;
    return true;
  });

  if (isLoading) {
    return (
      <div className='container mx-auto space-y-6 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <Skeleton className='h-8 w-48 mb-2' />
            <Skeleton className='h-4 w-72' />
          </div>
          <Skeleton className='h-10 w-32' />
        </div>

        <div className='flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border'>
          <Skeleton className='h-10 flex-1' />
          <Skeleton className='h-10 w-48' />
          <Skeleton className='h-10 w-32' />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className='h-48 w-full rounded-xl' />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto space-y-6 p-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>User Invitations</h1>
          <p className='text-muted-foreground text-sm mt-1'>
            Manage and issue onboarding invitation links for new users
          </p>
        </div>
        <InvitationActionComponents />
      </div>

      {/* Filter Bar */}
      <div className='flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border border-border shadow-sm'>
        <InvitationFilterComponents />
      </div>

      {/* Card Grid UI */}
      {filteredInvitations.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border bg-card/50'>
          <Mail className='h-12 w-12 text-muted-foreground/40 mb-3' />
          <h3 className='font-semibold text-foreground text-lg'>No Invitations Found</h3>
          <p className='text-sm text-muted-foreground mt-1 max-w-sm'>
            {queryParams.search || queryParams.role || statusFilter
              ? 'Try adjusting your search criteria or filters.'
              : 'Click "Invite User" above to send a new onboarding invitation link.'}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr'>
          {filteredInvitations.map((invitation) => (
            <InvitationCard key={invitation.id} invitation={invitation} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredInvitations.length > 0 && pagination && (
        <PaginationWithLinks pagination={pagination} isTable={false} />
      )}
    </div>
  );
};

export default StaffInvitationsPage;
