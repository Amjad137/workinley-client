import { ENTITY_SORT, SORT_BY } from '@/constants/common.constants';

export interface ICommonResponseDTO<T> {
  error: boolean;
  message: string;
  data: T;
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IPaginatedResponseDTO<T> {
  results: T[];
  pagination: IPaginationMeta;
  message?: string;
}

export interface IListResponseDTO<T> {
  results: T[];
  message?: string;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: SORT_BY;
  sortOrder?: ENTITY_SORT;
  createdFrom?: string;
  createdTo?: string;
  hideDeleted?: boolean;
  status?: string;
}

export interface PreSignedURLResponseDTO {
  urls: {
    key: string;
    url: string;
  }[];
}
