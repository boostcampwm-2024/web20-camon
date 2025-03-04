import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal, CloseIcon } from '@/shared/ui';
import { Button } from '@/shared/ui/shadcn/button';
import { AuthContext } from '@/shared/contexts';
import { BookmarkData, getBookmarks, useBookmarkMutation } from '@/features/bookmark';

export function Bookmark() {
  const { isLoggedIn } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookmarkData>();

  const { data: bookmarkList = [] } = useQuery<BookmarkData[]>({
    queryKey: ['bookmarks'],
    queryFn: getBookmarks,
    enabled: isLoggedIn,
    staleTime: 1000 * 50 * 5,
  });

  const { mutateAdd, mutateDelete } = useBookmarkMutation({
    onAddSuccess: () => {
      reset();
      setShowModal(false);
    },
  });

  const handleClickBookmarkButton = (url: string) => {
    window.open(url);
  };

  const handleAddBookmark = (newBookmark: BookmarkData) => {
    if (!isLoggedIn) return;
    mutateAdd(newBookmark);
  };

  const handleDeleteBookmark = (e: React.MouseEvent, bookmarkId: number) => {
    e.stopPropagation();
    if (!isLoggedIn) return;
    mutateDelete(bookmarkId);
  };

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
