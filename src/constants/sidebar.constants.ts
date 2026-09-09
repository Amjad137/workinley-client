import {
  BarChart3,
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  Users,
  FileText,
  UserCheck,
  Mail,
} from 'lucide-react';
import { ROUTES } from './routes.constants';

export const SIDEBAR_MENU_CATEGORIES = {
  HOME: 'Home',
  REPORTS: 'Reports',
  USERS_MANAGEMENT: 'Users Management',
  TEAM: 'Team',
  MANAGEMENT: 'Management',
};

export const COMMON_SIDEBAR_MENU_ITEMS = {
  HOME: [
    {
      name: 'Dashboard',
      url: ROUTES.SAAS_ROOT,
      icon: LayoutDashboard,
    },
  ],
};

// Items for Admin sidebar
export const ADMIN_SIDEBAR_MENU_ITEMS = {
  HOME: [{ name: 'Dashboard', url: ROUTES.DASHBOARD_ROOT, icon: LayoutDashboard }],
  REPORTS: [
    { name: 'All Reports', url: ROUTES.REVIEWS_ROOT, icon: ClipboardCheck },
    { name: 'Projects', url: ROUTES.PROJECTS_ROOT, icon: FolderKanban },
  ],
  TEAM: [
    { name: 'Analytics', url: ROUTES.DASHBOARD_ROOT, icon: BarChart3 },
    { name: 'Team Members', url: ROUTES.TEAM_ROOT, icon: UserCheck },
  ],
  MANAGEMENT: [
    { name: 'Users', url: ROUTES.USERS_ROOT, icon: Users },
    { name: 'Invitations', url: ROUTES.INVITATIONS_ROOT, icon: Mail },
  ],
};

// Items for Manager sidebar (no User Management)
export const MANAGER_SIDEBAR_MENU_ITEMS = {
  HOME: [{ name: 'Dashboard', url: ROUTES.DASHBOARD_ROOT, icon: LayoutDashboard }],
  REPORTS: [
    { name: 'All Reports', url: ROUTES.REVIEWS_ROOT, icon: ClipboardCheck },
    { name: 'Projects', url: ROUTES.PROJECTS_ROOT, icon: FolderKanban },
  ],
  TEAM: [
    { name: 'Analytics', url: ROUTES.DASHBOARD_ROOT, icon: BarChart3 },
    { name: 'Team Members', url: ROUTES.TEAM_ROOT, icon: UserCheck },
  ],
};

// Items for Team Member sidebar
export const MEMBER_SIDEBAR_MENU_ITEMS = {
  HOME: [{ name: 'My Reports', url: ROUTES.REPORTS_ROOT, icon: FileText }],
};
