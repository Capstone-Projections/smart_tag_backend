export interface UserInput {
    firstName: string;
    lastName: string;
    email: string;
    middleName?: string;
    password?: string;
    referenceNumber?: string;
    indexNumber?: number;
    studyProgram?: string;
    doubtPoints?: number;
    role: UserRole;
}

export interface UpdateUserInput {
    firstName?: string;
    lastName?: string;
    email?: string;
    middleName?: string;
    password?: string;
    referenceNumber?: string;
    indexNumber?: number;
    studyProgram?: string;
    doubtPoints?: number;
    role?: UserRole;
}

type UserRole = 'LECTURER' | 'STUDENT';
