import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/avatar';
import { UserData } from '@/pages/Profile';
import { Field } from '@/shared/types/sharedTypes';
import { Button } from '@/shared/ui/shadcn/button';
import { axiosInstance } from '@/shared/api';
import { useToast } from '@/shared/lib';

type EditUserInfoProps = Readonly<{
  userData: UserData | undefined;
  toggleEditing: () => void;
}>;

export type FormInput = {
  camperId: string | undefined;
  name: string | undefined;
  field: Field | undefined;
  email: string | undefined;
  github: string | undefined;
  blog: string | undefined;
  linkedIn: string | undefined;
};

export function EditUserInfo({ userData, toggleEditing }: EditUserInfoProps) {
  const [selectedField, setSelectedField] = useState<Field | undefined>(userData?.field);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      camperId: userData?.camperId,
      name: userData?.name,
      field: userData?.field,
      email: userData?.contacts.email,
      github: userData?.contacts.github,
      blog: userData?.contacts.blog,
      linkedIn: userData?.contacts.linkedIn,
    },
  });
  const { toast } = useToast();

  const handleSelectField = (field: Field) => {
    setSelectedField(selectedField === field ? '' : field);
  };

  const handlePatchUserInfo = (data: FormInput) => {
    const formData = {
      name: data.name,
      camperId: data.camperId,
      field: selectedField,
      contacts: {
        email: data.email ? data.email : '',
        github: data.github ? data.github : '',
        blog: data.blog ? data.blog : '',
        linkedin: data.linkedIn ? data.linkedIn : '',
      },
    };

    if (!formData.field) return;

    axiosInstance.patch('/v1/members/info', formData).then(response => {
      if (response.data.success) {
        toggleEditing();
      } else {
        toast({ variant: 'destructive', title: '유저 정보 수정 실패' });
      }
    });
  };

  return (
    <div className="flex flex-col items-center w-full gap-10">
      <Avatar className="w-64 h-64">
        <AvatarImage src={userData?.profileImage} />
        <AvatarFallback>MY</AvatarFallback>
      </Avatar>
      <form onSubmit={handleSubmit(handlePatchUserInfo)} className="flex flex-col w-1/2 gap-5">
        {/* ID */}
        <div className="relative flex flex-row justify-end items-center">
          <label htmlFor="camperId-input" className="flex flex-row w-full text-text-strong text-display-bold24">
            <span className="flex w-32">ID</span>
            <input
              id="camperId-input"
              {...register('camperId', {
                required: 'ID를 입력해주세요',
              })}
              className="flex-1 h-10 bg-transparent border border-default rounded-md focus:border-bold px-3 text-display-medium16 text-text-default"
            />
          </label>
          <p className="absolute top-10 right-0 justify-end text-text-danger text-display-medium12">
            {errors.camperId?.message}
          </p>
        </div>
        {/* 이름 */}
        <div className="relative flex flex-row items-center">
          <label htmlFor="name-input" className="flex flex-row w-full text-text-strong text-display-bold24">
            <span className=" w-32">이름</span>
            <input
              id="name-input"
              {...register('name', {
                required: '이름을 입력해주세요',
              })}
              className="flex-1 h-10 bg-transparent border border-default rounded-md focus:border-bold px-3 text-display-medium16 text-text-default"
            />
          </label>
          <p className="absolute top-10 right-0 text-text-danger text-display-medium12">{errors.name?.message}</p>
        </div>
        {/* email */}
        <div className="flex flex-row items-center">
          <label htmlFor="email-input" className="flex flex-row w-full text-text-strong text-display-bold24">
            <span className=" w-32">Email</span>
            <input
              id="email-input"
              {...register('email')}
              className="flex-1 h-10 bg-transparent border border-default rounded-md focus:border-bold px-3 text-display-medium16 text-text-default"
            />
          </label>
        </div>
        {/* github */}
        <div className="flex flex-row items-center">
          <label htmlFor="github-input" className="flex flex-row w-full text-text-strong text-display-bold24">
            <span className=" w-32">Github</span>
            <input
              id="github-input"
              {...register('github')}
              className="flex-1 h-10 bg-transparent border border-default rounded-md focus:border-bold px-3 text-display-medium16 text-text-default"
            />
          </label>
        </div>
        {/* blog */}
        <div className="flex flex-row items-center">
          <label htmlFor="blog-input" className="flex flex-row w-full text-text-strong text-display-bold24">
            <span className=" w-32">Blog</span>
            <input
              id="blog-input"
              {...register('blog')}
              className="flex-1 h-10 bg-transparent border border-default rounded-md focus:border-bold px-3 text-display-medium16 text-text-default"
            />
          </label>
        </div>
        {/* linkedIn */}
        <div className="flex flex-row items-center">
          <label htmlFor="linkedIn-input" className="flex flex-row w-full text-text-strong text-display-bold24">
            <span className="flex w-32">LinkedIn</span>

            <input
              id="linkedIn-input"
              {...register('linkedIn')}
              className="flex-1 h-10 bg-transparent border border-default rounded-md focus:border-bold px-3 text-display-medium16 text-text-default"
            />
          </label>
        </div>
        {/* 분야 */}
        <div className="relative flex flex-row w-full justify-start items-center">
          <span id="field-label" className="w-32 text-text-strong text-display-bold24">
            분야
          </span>
          <fieldset className="flex flex-1 justify-start gap-4">
            <legend className="sr-only">Select your field</legend>
            <Button
              type="button"
              onClick={() => handleSelectField('WEB')}
              className={`${selectedField === 'WEB' && 'bg-surface-brand-default hover:bg-surface-brand-alt'}`}
            >
              WEB
            </Button>
            <Button
              type="button"
              onClick={() => handleSelectField('AND')}
              className={`${selectedField === 'AND' && 'bg-surface-brand-default hover:bg-surface-brand-alt'}`}
            >
              AND
            </Button>
            <Button
              type="button"
              onClick={() => handleSelectField('IOS')}
              className={`${selectedField === 'IOS' && 'bg-surface-brand-default hover:bg-surface-brand-alt'}`}
            >
              IOS
            </Button>
            <p className="absolute top-10 right-0 text-text-danger text-display-medium12">
              {selectedField === '' && '분야를 입력해주세요'}
            </p>
          </fieldset>
        </div>
        <div className="flex w-full justify-end">
          <Button type="submit" className="h-10 shrink-0">
            저장
          </Button>
        </div>
      </form>
    </div>
  );
}
