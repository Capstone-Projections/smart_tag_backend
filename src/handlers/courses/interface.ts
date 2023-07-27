export type CourseInput = {
    courseCode: string;
    name: string;
};

export type UpdateCourseInput = {
    courseCode?: string;
    name?: string;
};

export type IndexNumberConnect = {
    indexNumber: number;
};

export type IndexNumberConnectArray = {
    'Index Numbers': number[];
};
