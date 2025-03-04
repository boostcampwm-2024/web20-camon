import { Field } from '@/shared/types';

export type FormInput = {
  camperId: string | undefined;
  name: string | undefined;
  field: Field | undefined;
  email: string | undefined;
  github: string | undefined;
  blog: string | undefined;
  linkedIn: string | undefined;
};
