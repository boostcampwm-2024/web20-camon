import { Field } from '@/shared/types';
import { FormInput } from './types';
import { MutationUserData } from '@/entities/user';

export const transformFormToApiData = (data: FormInput, selectedField: Field | undefined): MutationUserData => ({
    name: data.name!,
    camperId: data.camperId!,
    field: selectedField!,
    contacts: {
      email: data.email ? data.email : '',
      github: data.github ? data.github : '',
      blog: data.blog ? data.blog : '',
      linkedin: data.linkedIn ? data.linkedIn : '',
    },
  });
