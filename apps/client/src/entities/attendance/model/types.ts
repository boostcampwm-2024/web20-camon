export type AttendanceData = {
  attendanceId: number;
  date: string;
  startTime: string;
  endTime: string;
  isAttendance: boolean;
};

export type AttendanceResponse = {
  success: boolean;
  status: string;
  message: string;
  data: {
    memberId: number;
    attendances: AttendanceData[];
  };
};
