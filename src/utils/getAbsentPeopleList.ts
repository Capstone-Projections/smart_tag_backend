interface Student {
    indexNumber: number | null;
}

interface AttendanceRecord {
    user: Student;
}

// Function to get the list of students who are not present for the class
export function getAbsentStudents(
    allStudents: Student[],
    attendedStudents: AttendanceRecord[]
): Student[] {
    // Extract the indexNumbers of students who attended the class
    const attendedIndexNumbers = attendedStudents.map(
        (attendance) => attendance.user.indexNumber
    );

    // Filter out the students who are not present for the class
    const absentStudents = allStudents.filter(
        (student) => !attendedIndexNumbers.includes(student.indexNumber)
    );

    return absentStudents;
}
