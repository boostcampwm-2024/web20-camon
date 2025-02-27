import { useEffect, useState } from 'react';
import { FieldFilter, LivePreviewCard, Search, LivePreviewInfo } from '@/features/liveList';
import { Field } from '@/shared/types/sharedTypes';
import { useIntersect } from '@/shared/lib';
import { useLivePreviewList, useSearchLivePreviewList } from '@/features/liveList/model/queries';

export function LiveList() {
  const [field, setField] = useState<Field>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [liveList, setLiveList] = useState<LivePreviewInfo[]>([]);

  const { data: infiniteData, fetchNextPage, hasNextPage, isFetching } = useLivePreviewList(field);

  const { data: searchData } = useSearchLivePreviewList(searchKeyword);

  const { ref } = useIntersect({
    onIntersect: (entry, observer) => {
      observer.unobserve(entry.target);
      if (hasNextPage && !isFetching && !isSearching) {
        fetchNextPage();
      }
    },
    options: { threshold: 0.3 },
  });

  useEffect(() => {
    if (!isSearching && infiniteData) {
      const newList = infiniteData.pages.flatMap(page => page.broadcasts);
      setLiveList(newList);
    }
  }, [infiniteData, isSearching]);

  useEffect(() => {
    if (isSearching && searchData) {
      setLiveList(searchData);
    }
  }, [searchData, isSearching]);

  const handleFilterField = (selectedField: Field) => {
    setField(selectedField);
    setIsSearching(false);
    setSearchKeyword('');
  };

  const handleSearch = (keyword: string) => {
    if (keyword.trim() === '') {
      setIsSearching(false);
      setSearchKeyword('');
    }
    setSearchKeyword(keyword);
    setField('');
    setIsSearching(true);
  };

  return (
    <div className="flex flex-col w-full flex-1 p-10 justify-start items-center">
      <div className="h-14 w-full flex justify-between items-center my-5 px-5">
        <FieldFilter onClickFilterButton={handleFilterField} />
        <Search onSearch={handleSearch} />
      </div>
      <div className="flex flex-col w-full h-full items-center">
        <div className="grid grid-cols-1 min-[690px]:grid-cols-2 min-[1040px]:grid-cols-3 min-[1380px]:grid-cols-4 min-[1720px]:grid-cols-5 gap-x-[clamp(40px,2vw,60px)] gap-y-12 auto-rows-min p-15 w-[95%] max-w-[1920px] align-items-start">
          {liveList ? (
            liveList.map(data => {
              const { broadcastId, broadcastTitle, camperId, profileImage, thumbnail } = data;
              return (
                <div key={broadcastId} className="flex justify-center">
                  <LivePreviewCard
                    liveId={broadcastId}
                    title={broadcastTitle}
                    userId={camperId}
                    profileUrl={profileImage}
                    thumbnailUrl={thumbnail}
                  />
                </div>
              );
            })
          ) : (
            <div>방송 정보가 없습니다.</div>
          )}
        </div>
        <div ref={ref} className="h-1" />
      </div>
    </div>
  );
}
