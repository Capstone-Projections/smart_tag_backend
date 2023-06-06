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
    isAdmin?: boolean;
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
    isAdmin?: boolean;
}

type UserRole = 'LECTURER' | 'STUDENT';
