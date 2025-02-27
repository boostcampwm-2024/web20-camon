import { Field } from '@/shared/types/sharedTypes';

export type LivePreviewInfo = {
  broadcastId: string;
  broadcastTitle: string;
  camperId: string;
  profileImage: string;
  thumbnail: string;
  field: Field;
};

export type Cursor = string | null;

export type LivePreviewListInfo = {
  broadcasts: LivePreviewInfo[];
  nextCursor: Cursor;
};
