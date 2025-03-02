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

export type MutationUserData = {
  contacts: {
    email: string;
    github: string;
    blog: string;
    linkedin: string;
  };
} & Pick<UserData, 'camperId' | 'name' | 'field'>;
