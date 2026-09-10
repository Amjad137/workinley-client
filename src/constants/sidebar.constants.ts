import {
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
  WORKSPACE: 'Workspace',
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
  HOME: [{ name: 'Dashboard', url: ROUTES.STAFF_DASHBOARD, icon: LayoutDashboard }],
  REPORTS: [
    { name: 'All Reports', url: ROUTES.STAFF_REVIEWS, icon: ClipboardCheck },
    { name: 'Projects', url: ROUTES.STAFF_PROJECTS, icon: FolderKanban },
  ],
  TEAM: [{ name: 'Team Members', url: ROUTES.STAFF_TEAM, icon: UserCheck }],
  MANAGEMENT: [
    { name: 'Users', url: ROUTES.STAFF_USERS, icon: Users },
    { name: 'Invitations', url: ROUTES.STAFF_INVITATIONS, icon: Mail },
  ],
};

// Items for Manager sidebar (no User Management)
export const MANAGER_SIDEBAR_MENU_ITEMS = {
  HOME: [{ name: 'Dashboard', url: ROUTES.STAFF_DASHBOARD, icon: LayoutDashboard }],
  REPORTS: [
    { name: 'All Reports', url: ROUTES.STAFF_REVIEWS, icon: ClipboardCheck },
    { name: 'Projects', url: ROUTES.STAFF_PROJECTS, icon: FolderKanban },
  ],
  TEAM: [{ name: 'Team Members', url: ROUTES.STAFF_TEAM, icon: UserCheck }],
};

// Items for Team Member sidebar
export const MEMBER_SIDEBAR_MENU_ITEMS = {
  HOME: [
    { name: 'Dashboard', url: ROUTES.USER_DASHBOARD, icon: LayoutDashboard },
    { name: 'My Reports', url: ROUTES.REPORTS_ROOT, icon: FileText },
    { name: 'Projects', url: ROUTES.PROJECTS_ROOT, icon: FolderKanban },
  ],
};
