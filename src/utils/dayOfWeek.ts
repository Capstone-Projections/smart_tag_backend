export function getDayOfWeek(dateString: string): string {
    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Months in JavaScript are 0-indexed
    const day = parseInt(dateParts[2]);

    const date = new Date(year, month, day);
    const daysOfWeek: string[] = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    const dayOfWeek = daysOfWeek[date.getDay()];

    return dayOfWeek;
}
