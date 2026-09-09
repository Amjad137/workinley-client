import { USER_ROLE } from '@/constants/user.constants';
import { IPaginationQuery } from './common.dto';

export enum INVITATION_STATUS {
  ALL = 'ALL',
  PENDING = 'PENDING',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
}

export interface IUserInvitation {
  id: string;
  email: string;
  role: USER_ROLE;
  invitationCode: string;
  isUsed: boolean;
  expiresAt: string;
  usedAt?: string | null;
  invitedById?: string | null;
  usedById?: string | null;
  createdAt: string;
  updatedAt: string;
  inviteLink?: string;
  invitedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  usedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface ICreateUserInvitationDTO {
  email: string;
  role: USER_ROLE;
}

export interface IUserInvitationQuery extends IPaginationQuery {
  role?: USER_ROLE;
  status?: string;
  search_key?: string;
  skip?: number;
}

export interface IValidateInvitationResponse {
  valid: boolean;
  email: string;
  role: USER_ROLE;
  expiresAt: string;
}
