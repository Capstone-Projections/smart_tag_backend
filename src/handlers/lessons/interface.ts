export interface LessonInput {
    startTime: string;
    endTime: string;
    day: string;
    idlectureRoom: number;
}

export interface LessonUpdateInput {
    startTime?: string;
    endTime?: string;
    day?: string;
    idlectureRoom?: number;
}
