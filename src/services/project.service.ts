import Axios from '@/config/api.config';
import { ICommonResponseDTO, IListResponseDTO, IPaginatedResponseDTO } from '@/dto/common.dto';
import {
  IProject,
  IProjectQuery,
  ICreateProjectFormValues,
  IUpdateProjectFormValues,
} from '@/dto/project.dto';
import { handleError } from '@/utils/error-handler';

const BASE = '/v1/projects';

export const fetchAllProjects = async (
  params?: IProjectQuery,
): Promise<IPaginatedResponseDTO<IProject>> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IPaginatedResponseDTO<IProject>>>(BASE, {
      params,
    });
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const fetchActiveProjects = async (): Promise<IProject[]> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IListResponseDTO<IProject>>>(`${BASE}/active`);
    return res.data.data.results ?? [];
  } catch (err) {
    return handleError(err);
  }
};

export const fetchProjectById = async (id: string): Promise<IProject> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IProject>>(`${BASE}/${id}`);
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const createProject = async (data: ICreateProjectFormValues): Promise<IProject> => {
  try {
    const res = await Axios.post<ICommonResponseDTO<IProject>>(BASE, data);
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const updateProject = async (
  id: string,
  data: IUpdateProjectFormValues,
): Promise<IProject> => {
  try {
    const res = await Axios.patch<ICommonResponseDTO<IProject>>(`${BASE}/${id}`, data);
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const archiveProject = async (id: string): Promise<IProject> => {
  try {
    const res = await Axios.patch<ICommonResponseDTO<IProject>>(`${BASE}/${id}/archive`);
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await Axios.delete(`${BASE}/${id}`);
  } catch (err) {
    return handleError(err);
  }
};
