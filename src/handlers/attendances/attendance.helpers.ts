export const currentDate: string = new Date().toISOString().slice(0, 10);

export function selectUsersFromAttendance(attendancePeople: any[]): any[] {
    // Sort the attendancePeople array based on doubtPoints in descending order
    attendancePeople.sort(
        (a, b) => (b.doubtPoints || 0) - (a.doubtPoints || 0)
    );

    const selectedUsers: any[] = [];
    const totalCount = attendancePeople.length;

    const topCount = Math.min(Math.floor(totalCount * 0.6), 6);
    const middleCount = Math.min(Math.floor(totalCount * 0.2), 2);
    const bottomCount = Math.min(Math.floor(totalCount * 0.2), 2);

    const shouldPickMoreFromMiddle = Math.random() < 0.3; // Adjust the probability as needed

    // Select users from the top section
    let topSectionCount = shouldPickMoreFromMiddle ? topCount - 1 : topCount;
    for (let i = 0; i < topSectionCount; i++) {
        if (attendancePeople.length === 0) {
            break; // Break if all users have been selected
        }
        selectedUsers.push(attendancePeople.shift());
    }

    // Select users from the middle section
    let middleSectionCount = middleCount + (shouldPickMoreFromMiddle ? 1 : 0);
    for (let i = 0; i < middleSectionCount; i++) {
        if (attendancePeople.length === 0) {
            break; // Break if all users have been selected
        }
        const middleIndex = Math.floor(attendancePeople.length / 2);
        selectedUsers.push(attendancePeople.splice(middleIndex, 1)[0]);
    }

    // Select users from the bottom section
    for (let i = 0; i < bottomCount; i++) {
        if (attendancePeople.length === 0) {
            break; // Break if all users have been selected
        }
        selectedUsers.push(attendancePeople.pop());
    }

    return selectedUsers;
}
