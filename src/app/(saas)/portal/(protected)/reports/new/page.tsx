'use client';

import ReportSheet from '@/components/saas/reports/report-sheet';
import { ROUTES } from '@/constants/routes.constants';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewReportPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back();
      } else {
        router.push(ROUTES.REPORTS_ROOT);
      }
    }
  };

  return <ReportSheet open={open} setOpen={handleOpenChange} />;
}
