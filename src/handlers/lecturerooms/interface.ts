export interface LectureroomInput {
    name: string;
    roomLocation: string;
    uid: string;
}

export interface UpdateLecturoomInput {
    name?: string;
    roomLocation?: string;
    uid?: string;
}
