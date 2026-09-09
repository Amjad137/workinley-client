import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const MemberProfileSkeleton = () => {
  return (
    <div className='container mx-auto px-4 py-6 space-y-6'>
      {/* Back button skeleton */}
      <div className='flex items-center gap-3'>
        <Skeleton className='h-9 w-24' />
        <Skeleton className='h-8 w-48' />
      </div>

      {/* Header skeleton */}
      <Card className='p-6'>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-16 w-16 rounded-full' />
          <div className='space-y-2 flex-1'>
            <Skeleton className='h-6 w-48' />
            <Skeleton className='h-4 w-72' />
          </div>
          <Skeleton className='h-9 w-32 hidden sm:block' />
        </div>
      </Card>

      {/* KPI Stats Skeletons */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className='h-28 rounded-lg' />
        ))}
      </div>

      {/* Status Breakdown Skeletons */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className='h-16 rounded-lg' />
        ))}
      </div>

      {/* Table Skeleton */}
      <Card className='p-6 space-y-4'>
        <Skeleton className='h-6 w-40' />
        <Skeleton className='h-4 w-60' />
        <div className='space-y-2 pt-2'>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className='h-12 w-full rounded-md' />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MemberProfileSkeleton;
