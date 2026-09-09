export enum ENVIRONMENTS {
  PRODUCTION = 'production',
  QA = 'qa',
  DEV = 'development',
  LOCAL = 'local',
}

export enum ENTITY_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  HIDDEN = 'HIDDEN',
  DELETED = 'DELETED',
}

export enum ENTITY_SORT {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SORT_BY {
  DATE = 'createdAt',
}

export enum API_QUERY_PARAMS {
  SEARCH = 'search',
  PAGE = 'page',
  LIMIT = 'limit',
  SKIP = 'skip',
  SORT_BY = 'sortBy',
  SORT_ORDER = 'sortOrder',
  CREATED_FROM = 'createdFrom',
  CREATED_TO = 'createdTo',
  HIDE_DELETED = 'hideDeleted',
  STATUS = 'status',
}

export const FILE_TYPES = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
} as const;
