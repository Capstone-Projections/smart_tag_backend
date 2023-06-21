import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';

export function jsonToCsv(
    jsonData: AttendanceRecord[],
    currentDateTime: string,
    courseCode: string,
    folder: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const indexNumbersSet = new Set<string>(); // Use a Set to store unique index numbers

        // Extract unique index numbers from the JSON data
        jsonData.forEach((obj) => {
            if (obj.user && obj.user.indexNumber) {
                indexNumbersSet.add(obj.user.indexNumber.toString());
            }
        });

        const indexNumbers = Array.from(indexNumbersSet); // Convert the Set back to an array

        const records = indexNumbers.map((indexNumber) => ({
            'Index Number': indexNumber,
        }));

        const csvFilePath = `${folder}/Present Students on ${currentDateTime} for ${courseCode}.csv`;
        const header = [{ id: 'Index Number', title: 'Index Number' }];
        const filePath = '../../' + csvFilePath;
        const fileDirectory = path.join(__dirname, filePath);

        const csvWriter = createObjectCsvWriter({
            path: fileDirectory,
            header,
        });

        csvWriter
            .writeRecords(records)
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

//this function does the extration of the data that is going to be used for the title of the csv file
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

//template for attendance
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
