import { useState } from 'react';
import { RecordInfo, RecordList, RecordPlayer } from './ui';

export type RecordData = {
  recordId: number;
  title: string;
  video: string;
  date: string;
};

export function RecordPage() {
  const [nowPlaying, setNowPlaying] = useState<RecordData>({ recordId: 0, title: '', video: '', date: '' });

  return (
    <div className="flex flex-row w-full h-full gap-10">
      <div className="flex flex-col flex-grow gap-4 h-full ml-8">
        <RecordPlayer video={nowPlaying.video} />
        <RecordInfo title={nowPlaying.title} />
      </div>
      <div className="h-full w-80 pr-5">
        <RecordList onClickList={setNowPlaying} />
      </div>
    </div>
  );
}
