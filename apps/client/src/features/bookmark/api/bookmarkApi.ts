import { axiosInstance } from '@/shared/api';
import { BookmarkData } from '@/features/bookmark';

export const getBookmarks = () => axiosInstance.get('/v1/bookmarks').then(res => res.data.data.bookmarks);

export const addBookmark = (newBookmark: BookmarkData) =>
  axiosInstance.post('/v1/bookmarks', newBookmark).then(res => res.data.data);

export const deleteBookmark = (bookmarkId: number) =>
  axiosInstance.delete(`/v1/bookmarks/${bookmarkId}`).then(res => res.data);
