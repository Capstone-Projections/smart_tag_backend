//TODO: ADD JSON to CSV converter function
import { createObjectCsvWriter } from 'csv-writer';

//this function does the conversion of the json file to csv format
export function jsonToCsv(
    jsonData: AttendanceRecord[],
    currentDateTime: string,
    courseCode: string
): void {
    // Extract the index numbers from the JSON data

    const indexNumbers = jsonData.map((obj) => obj.user.indexNumber);

    // Prepare the CSV records
    const records = indexNumbers.map((indexNumber) => ({
        'Index Number': indexNumber,
    }));

    // Define the CSV file path and header
    const csvFilePath = `Present students on ${currentDateTime} for ${courseCode}.csv`;
    const header = [{ id: 'Index Number', title: 'Index Number' }];

    // Create the CSV writer
    const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        header,
    });

    // Write the records to the CSV file
    csvWriter
        .writeRecords(records)
        .then(() => console.log('CSV file generated successfully'))
        .catch((error) => console.error('Error generating CSV file:', error));
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
