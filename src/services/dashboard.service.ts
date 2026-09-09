import Axios from '@/config/api.config';
import { ICommonResponseDTO, IListResponseDTO, IPaginatedResponseDTO } from '@/dto/common.dto';
import {
  IDashboardSummary,
  IComplianceMember,
  IComplianceQuery,
  ITaskVelocity,
  IHoursDistribution,
  IProjectWorkload,
  ITeamBlocker,
  IActivityFeedItem,
  IMemberStats,
} from '@/dto/dashboard.dto';
import { handleError } from '@/utils/error-handler';

const BASE = '/v1/analytics';

export const fetchDashboardSummary = async (
  weekNumber?: number,
  year?: number,
): Promise<IDashboardSummary> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IDashboardSummary>>(`${BASE}/summary`, {
      params: { weekNumber, year },
    });
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const fetchVelocityTrend = async (year?: number): Promise<ITaskVelocity[]> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IListResponseDTO<ITaskVelocity>>>(
      `${BASE}/velocity`,
      {
        params: { year },
      },
    );
    return res.data.data?.results ?? [];
  } catch (err) {
    return handleError(err);
  }
};

export const fetchHoursDistribution = async (
  weekNumber?: number,
  year?: number,
): Promise<IHoursDistribution> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IHoursDistribution>>(`${BASE}/hours`, {
      params: { weekNumber, year },
    });
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const fetchProjectWorkload = async (
  weekNumber?: number,
  year?: number,
): Promise<IProjectWorkload[]> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IListResponseDTO<IProjectWorkload>>>(
      `${BASE}/workload`,
      {
        params: { weekNumber, year },
      },
    );
    return res.data.data?.results ?? [];
  } catch (err) {
    return handleError(err);
  }
};

export const fetchComplianceMatrix = async (
  query?: IComplianceQuery,
): Promise<IPaginatedResponseDTO<IComplianceMember>> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IPaginatedResponseDTO<IComplianceMember>>>(
      `${BASE}/compliance`,
      { params: query },
    );
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const fetchTeamBlockers = async (
  weekNumber?: number,
  year?: number,
): Promise<ITeamBlocker[]> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IListResponseDTO<ITeamBlocker>>>(
      `${BASE}/blockers`,
      {
        params: { weekNumber, year },
      },
    );
    return res.data.data?.results ?? [];
  } catch (err) {
    return handleError(err);
  }
};

export const fetchActivityFeed = async (limit?: number): Promise<IActivityFeedItem[]> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IListResponseDTO<IActivityFeedItem>>>(
      `${BASE}/activity`,
      {
        params: { limit },
      },
    );
    return res.data.data?.results ?? [];
  } catch (err) {
    return handleError(err);
  }
};

export const fetchMemberStats = async (userId: string): Promise<IMemberStats> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IMemberStats>>(`${BASE}/member/${userId}`);
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};
