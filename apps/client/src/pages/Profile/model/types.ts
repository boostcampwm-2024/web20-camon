import { Field } from '@/shared/types/sharedTypes';

type Contacts = {
  email: string;
  github: string;
  blog: string;
  linkedIn: string;
};

export type UserData = {
  id: number;
  camperId: string;
  name: string;
  field: Field;
  contacts: Contacts;
  profileImage: string;
};
