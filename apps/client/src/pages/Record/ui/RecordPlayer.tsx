import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { LoadingCharacter } from '@/shared/ui';

export function RecordPlayer({ video }: Readonly<{ video: string }>) {
  const [isSelectedVideo, setIsSelectedVideo] = useState(false);

  useEffect(() => {
    if (video) {
      setIsSelectedVideo(true);
    }
  }, [video]);

  return (
    <div className="h-4/5 w-full">
      {isSelectedVideo ? (
        <div className="h-full w-full">
          <ReactPlayer
            aria-label="recorded video"
            url={video}
            playing
            controls
            width="100%"
            height="100%"
            fallback={
              <div className="flex justify-center items-center h-full w-full">
                <LoadingCharacter size={400} />
              </div>
            }
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-full w-full">오른쪽 목록에서 비디오를 선택해주세요</div>
      )}
    </div>
  );
}
