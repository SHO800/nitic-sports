const firstDay = new Date('2025-05-22');
const secondDay = new Date('2025-05-23')

export const judgeDay12 = (date: Date) => {
    const firstDayTime = firstDay.getTime();
    const secondDayTime = secondDay.getTime();
    const dateTime = date.getTime();

    if (dateTime >= firstDayTime && dateTime < secondDayTime) {
        return 1;
    } else if (dateTime >= secondDayTime) {
        return 2;
    } else {
        return 0;
    }
}

export const judgeDay12String = (date: Date): string | null => {
    const result = judgeDay12(date)
    if (result === 1) return "Day1";
    if (result === 2) return "Day2";
    return null;
    
}