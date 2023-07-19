import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';

interface AbsentStudent {
    indexNumber: number | null;
}

export function jsonToCsv(
    presentStudents: AttendanceRecord[],
    absentStudents: AbsentStudent[],
    currentDateTime: string,
    courseCode: string,
    folder: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const presentIndexNumbersSet = new Set<string>();
        const absentIndexNumbersSet = new Set<string>();

        // Extract unique index numbers for present students
        presentStudents.forEach((obj) => {
            if (obj.user && obj.user.indexNumber) {
                presentIndexNumbersSet.add(obj.user.indexNumber.toString());
            }
        });

        // Extract unique index numbers for absent students
        absentStudents.forEach((absentStudent) => {
            if (absentStudent.indexNumber !== null) {
                absentIndexNumbersSet.add(absentStudent.indexNumber.toString());
            }
        });

        const presentIndexNumbers = Array.from(presentIndexNumbersSet);
        const absentIndexNumbers = Array.from(absentIndexNumbersSet);

        const presentRecords = presentIndexNumbers.map((indexNumber) => ({
            Status: 'Present',
            'Index Number': indexNumber,
        }));

        const absentRecords = absentIndexNumbers.map((indexNumber) => ({
            Status: 'Absent',
            'Index Number': indexNumber,
        }));

        // Combine the records for present and absent students
        const allRecords = [...presentRecords, ...absentRecords];

        const csvFilePath = `${folder}/Attendance on ${currentDateTime} for ${courseCode}.csv`;
        const header = [
            { id: 'Status', title: 'Status' },
            { id: 'Index Number', title: 'Index Number' },
        ];

        const filePath = '../../' + csvFilePath;
        const fileDirectory = path.join(__dirname, filePath);

        const csvWriter = createObjectCsvWriter({
            path: fileDirectory,
            header,
        });

        csvWriter
            .writeRecords(allRecords)
            .then(() => {
                // console.log('CSV file generated successfully');
                resolve(csvFilePath);
            })
            .catch((error) => {
                console.error('Error generating CSV file:', error);
                reject(error);
            });
    });
}

export function extractMetadata(jsonData: AttendanceRecord[]): {
    currentDateTime: string;
    courseCode: string;
} {
    const firstObject = jsonData[0];
    const currentDateTime = firstObject.currentDateTime;
    const courseCode =
        firstObject.lesson.course_has_lesson[0].course.courseCode;
    return { currentDateTime, courseCode };
}
interface AttendanceRecord {
    idattendance: number;
    status: boolean;
    currentDateTime: string;
    lesson_idlesson: number;
    user_iduser: number;
    user: {
        indexNumber: number | null;
    };
    lesson: {
        course_has_lesson: {
            course: {
                courseCode: string;
            };
        }[];
    };
}
