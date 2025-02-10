import { Field } from '@/shared/types/sharedTypes';

export type LivePreviewInfo = {
  broadcastId: string;
  broadcastTitle: string;
  camperId: string;
  profileImage: string;
  thumbnail: string;
  field: Field;
};

export type LivePreviewListInfo = {
  broadcasts: LivePreviewInfo[];
  nextCursor: string | null;
};
