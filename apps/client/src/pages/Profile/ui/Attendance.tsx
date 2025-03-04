import { useNavigate } from 'react-router-dom';
import { ErrorCharacter, LoadingCharacter } from '@/shared/ui';
import { PlayIcon } from '@/shared/ui/Icons';
import { useAttendanceList } from '@/entities/attendance';

const ATTENDANCE_TABLE_HEADER = ['학습일', '시작 시간', '종료 시간', '출석 여부'];

export function Attendance() {
  const { attendanceList, error, isLoading } = useAttendanceList();
  const navigate = useNavigate();

  const handlePlayRecord = (attendanceId: number) => {
    navigate(`/record/${attendanceId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingCharacter size={200} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <ErrorCharacter size={200} message="출석부 조회에 실패했습니다" />
      </div>
    );
  }

  return (
    <div className="flex justify-center h-1/2 w-full">
      <div className="flex flex-col h-full w-[80vw] border border-border-bold border-b-transparent rounded-t">
        <div className="flex flex-row justify-around items-center gap-11 bg-surface-alt w-full h-14 rounded-t">
          {ATTENDANCE_TABLE_HEADER.map((data: string) => (
            <div key={data} className="flex flex-1 justify-center items-center text-display-bold24 text-text-bold">
              {data}
            </div>
          ))}
        </div>

        <div className="overflow-y-auto text-text-default text-display-medium16">
          {attendanceList?.map(data => (
            <div key={data.attendanceId} className="flex flex-row justify-around items-center h-12 border-b gap-11">
              <div className="flex flex-1 justify-center items-center">{data.date}</div>
              <div className="flex flex-1 justify-center items-center">{data.startTime}</div>
              <div className="flex flex-1 justify-center items-center">{data.endTime}</div>
              <div className="flex flex-1 justify-center items-center">
                <div className="flex flex-row items-center justify-between gap-3">
                  <span className={data.isAttendance ? 'text-text-default' : 'text-text-danger'}>
                    {data.isAttendance ? '출석' : '결석'}
                  </span>
                  <button type="button" onClick={() => handlePlayRecord(data.attendanceId)} aria-label="녹화 영상 보기">
                    <PlayIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
