import { PROJECT_STATUS } from '@/constants/project.constants';
import { IPaginationQuery } from './common.dto';

export interface IProject {
  id: string;
  name: string;
  code: string;
  description?: string;
  color: string;
  status: PROJECT_STATUS;
  createdAt: string;
  updatedAt: string;
}

export interface IProjectQuery extends IPaginationQuery {
  status?: PROJECT_STATUS;
}

export interface ICreateProjectFormValues {
  name: string;
  code: string;
  description?: string;
  color?: string;
}

export interface IUpdateProjectFormValues extends Partial<ICreateProjectFormValues> {
  status?: PROJECT_STATUS;
}
