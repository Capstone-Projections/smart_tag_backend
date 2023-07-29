export interface AttendanceInput {
    status: boolean;
    lesson_idlesson: number;
    user_iduser: number;
}

export interface UpdateAttendanceInput {
    status?: boolean;
    lesson_idlesson?: number;
    user_iduser?: number;
}

export interface Analytics {
    currentDateTime: string;
}

export interface LecturerAttendanceInput {
    status: boolean;
    lesson_idlesson: number;
    indexNumber: number;
}
