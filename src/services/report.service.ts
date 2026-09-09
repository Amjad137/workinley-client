import Axios from '@/config/api.config';
import { ICommonResponseDTO, IPaginatedResponseDTO } from '@/dto/common.dto';
import { IWeeklyReport, IReportQuery, IReportFormValues } from '@/dto/report.dto';
import { handleError } from '@/utils/error-handler';

const BASE = '/v1/reports';

// Team Member
export const fetchMyReports = async (
  params?: IReportQuery,
): Promise<IPaginatedResponseDTO<IWeeklyReport>> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IPaginatedResponseDTO<IWeeklyReport>>>(
      `${BASE}/my`,
      { params },
    );
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const fetchReportById = async (id: string) => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IWeeklyReport>>(`${BASE}/${id}`);
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const createReport = async (data: IReportFormValues) => {
  try {
    const res = await Axios.post<ICommonResponseDTO<IWeeklyReport>>(BASE, data);
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const updateReport = async (id: string, data: Partial<IReportFormValues>) => {
  try {
    const res = await Axios.patch<ICommonResponseDTO<IWeeklyReport>>(`${BASE}/${id}`, data);
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const submitReport = async (id: string) => {
  try {
    const res = await Axios.post<ICommonResponseDTO<IWeeklyReport>>(`${BASE}/${id}/submit`);
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const deleteReport = async (id: string) => {
  try {
    await Axios.delete(`${BASE}/${id}`);
  } catch (err) {
    return handleError(err);
  }
};

// Manager
export const fetchAllTeamReports = async (
  params?: IReportQuery,
): Promise<IPaginatedResponseDTO<IWeeklyReport>> => {
  try {
    const res = await Axios.get<ICommonResponseDTO<IPaginatedResponseDTO<IWeeklyReport>>>(
      `${BASE}/manager/all`,
      { params },
    );
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const approveReport = async (id: string, comment?: string) => {
  try {
    const res = await Axios.post<ICommonResponseDTO<IWeeklyReport>>(
      `${BASE}/manager/${id}/approve`,
      { comment },
    );
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};

export const requestChanges = async (id: string, comment: string) => {
  try {
    const res = await Axios.post<ICommonResponseDTO<IWeeklyReport>>(
      `${BASE}/manager/${id}/request-changes`,
      { comment },
    );
    return res.data.data;
  } catch (err) {
    return handleError(err);
  }
};
