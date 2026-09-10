interface StaffDashboardHeaderProps {
  weekNumber: number;
  year: number;
}

export const StaffDashboardHeader = ({ weekNumber, year }: StaffDashboardHeaderProps) => {
  return (
    <div>
      <h1 className='text-2xl font-bold text-foreground'>Staff Executive Dashboard</h1>
      <p className='text-sm text-muted-foreground mt-1'>
        Week {weekNumber} / {year} - Real-time team velocity, compliance & analytics
      </p>
    </div>
  );
};

export default StaffDashboardHeader;
