import { Field } from '@/shared/types/sharedTypes';

export type ContactInfo = {
  github: string;
  linkedin: string;
  email: string;
  blog: string;
};

export type LiveInfo = {
  title: string;
  camperId: string;
  viewers: number;
  field: Field;
  profileImage: string;
  contacts: ContactInfo;
};
