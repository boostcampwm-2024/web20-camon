import { UserData } from '@/entities/user';

export type LiveInfo = {
  title: string;
  viewers: number;
} & UserData;
