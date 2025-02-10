import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import { Modal, CloseIcon } from '@/shared/ui';
import { Button } from '@/shared/ui/shadcn/button';
import { useToast } from '@/shared/lib';
import { AuthContext } from '@/shared/contexts';
import { axiosInstance } from '@/shared/api';
import { BookmarkData } from './types';

export function Bookmark() {
  const { isLoggedIn } = useContext(AuthContext);
  const [bookmarkList, setBookmarkList] = useState<BookmarkData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookmarkData>();
  const { toast } = useToast();

  const handleClickBookmarkButton = (url: string) => {
    window.open(url);
  };

  const handleAddBookmark = (newBookmark: BookmarkData) => {
    if (!isLoggedIn) return;
    axiosInstance
      .post('/v1/bookmarks', newBookmark)
      .then(response => {
        if (response.data.success) {
          const addedBookmark = { ...newBookmark, bookmarkId: response.data.data.bookmarkId };
          const newBookmarkList = [...bookmarkList, addedBookmark];
          setBookmarkList(newBookmarkList);
        } else {
          toast({ variant: 'destructive', title: '북마크 생성 실패' });
        }
      })
      .finally(() => {
        reset();
        setShowModal(false);
      });
  };

  const handleDeleteBookmark = (e: React.MouseEvent, bookmarkId: number) => {
    e.stopPropagation();

    if (!isLoggedIn) return;
    axiosInstance.delete(`/v1/bookmarks/${bookmarkId}`).then(response => {
      if (response.data.success) {
        const newBookmarkList = bookmarkList.filter((data, _) => data.bookmarkId !== bookmarkId);
        setBookmarkList(newBookmarkList);
      } else {
        toast({ variant: 'destructive', title: '북마크 삭제 실패' });
      }
    });
  };

  useEffect(() => {
    axiosInstance.get('/v1/bookmarks').then(response => {
      if (response.data.success) {
        setBookmarkList(response.data.data.bookmarks);
      } else {
        toast({ variant: 'destructive', title: '북마크 조회 실패' });
      }
    });
  }, [toast]);

  return (
    <>
      {isLoggedIn && (
        <div className="flex flex-col h-full gap-3 p-3">
          {bookmarkList?.map(data => (
            <div
              className="flex h-14 w-52 bg-surface-alt rounded-xl items-center hover:bg-surface-alt-light"
              key={data.bookmarkId}
            >
              <button
                type="button"
                onClick={() => handleClickBookmarkButton(data.url)}
                className="flex-1 truncate text-text-strong text-xl relative flex items-center justify-between px-4 py-2"
              >
                <span className="truncate flex-1">{data.name}</span>
              </button>
              <button
                type="button"
                onClick={e => handleDeleteBookmark(e, data.bookmarkId)}
                className="flex w-9 h-9 items-center p-1 hover:text-text-strong hover:cursor-pointer"
              >
                <CloseIcon size={36} />
              </button>
            </div>
          ))}

          {bookmarkList.length < 5 && (
            <Button onClick={() => setShowModal(true)} className="h-14 w-52 bg-surface-alt hover:bg-surface-alt-light">
              +
            </Button>
          )}
        </div>
      )}
      {showModal &&
        createPortal(
          <Modal setShowModal={setShowModal} modalClassName="h-fit w-1/3">
            <div className="flex w-full h-full p-4">
              <form onSubmit={handleSubmit(handleAddBookmark)} className="flex flex-col gap-2 w-full">
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex flex-col w-full">
                    <label htmlFor="bookmark-name-input">
                      <span>사이트명</span>
                      <input
                        id="bookmark-name-input"
                        {...register('name', {
                          required: '북마크 이름을 입력해주세요',
                        })}
                        className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col w-full">
                    <label htmlFor="bookmark-url-input">
                      <span>URL</span>
                      <input
                        id="bookmark-url-input"
                        {...register('url', {
                          required: '저장할 사이트 URL을 입력해주세요',
                        })}
                        className="w-full h-10 bg-transparent border border-default rounded-md focus:border-bold px-3"
                      />
                    </label>
                  </div>
                  {(errors.name || errors.url) && (
                    <p className="absolute top-11 text-text-danger font-medium text-display-medium12">
                      {errors.name ? errors.name.message : errors.url?.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="h-10 shrink-0">
                    저장
                  </Button>
                </div>
              </form>
            </div>
          </Modal>,
          document.body,
        )}
    </>
  );
}
