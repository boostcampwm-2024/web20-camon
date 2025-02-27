import { axiosInstance } from '@/shared/api';
import { Field } from '@/shared/types';
import { Cursor, LivePreviewInfo, LivePreviewListInfo } from '../model';

const LIMIT = 12;

export const getLivePreviewList = async (field: Field, cursor: Cursor): Promise<LivePreviewListInfo> => {
  const response = await axiosInstance.get('/v1/broadcasts', { params: { field, cursor, limit: LIMIT } });
  if (!response.data.success) {
    throw new Error('방송 목록 조회에 실패했습니다.');
  }
  return response.data.data;
};

export const searchLivePreviewList = async (keyword: string): Promise<LivePreviewInfo[]> => {
  const response = await axiosInstance.get('/v1/broadcasts/search', { params: { keyword: keyword.trim() } });
  if (!response.data.success) {
    throw new Error('방송 목록 검색에 실패했습니다.');
  }
  return response.data.data;
};
