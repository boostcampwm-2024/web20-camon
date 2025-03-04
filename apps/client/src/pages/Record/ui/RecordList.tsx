import { useParams } from 'react-router-dom';
import { PlayIcon, ErrorCharacter, LoadingCharacter } from '@/shared/ui';
import { RecordData, useRecordList } from '@/entities/record';

type RecordListProps = Readonly<{
  onClickList: (data: RecordData) => void;
}>;

export function RecordList({ onClickList }: RecordListProps) {
  const { attendanceId } = useParams<{ attendanceId: string }>();
  const { data: recordList, isLoading, isError } = useRecordList(attendanceId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingCharacter size={200} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center">
        <ErrorCharacter size={200} message={`${'녹화 목록 조회 실패'}`} />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full border border-border-default rounded p-5 overflow-hidden">
      {isError ? (
        <div>
          <ErrorCharacter size={100} message="녹화 영상 목록 조회에 실패했습니다" />
        </div>
      ) : (
        <div className="h-full w-full overflow-y-auto">
          <div className="flex flex-col gap-6">
            {recordList.map((record: RecordData) => (
              <button
                key={record.recordId}
                type="button"
                className="flex flex-row w-full h-12 justify-center items-center rounded gap-3 overflow-hidden bg-surface-alt cursor-pointer"
                onClick={() =>
                  onClickList({
                    recordId: record.recordId,
                    title: record.title,
                    video: record.video,
                    date: record.date,
                  })
                }
              >
                <PlayIcon />
                <p className="w-4/5 text-text-default text-display-medium16 truncate">{record.title}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
