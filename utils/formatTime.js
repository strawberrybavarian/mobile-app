export const formatTime = (time) => {
    if (!time) return 'Invalid time'; // Return a default message if time is undefined
    const [hour, minute] = time.split(':');
    const parsedHour = parseInt(hour, 10);
    if (parsedHour === 12) {
        return `${hour}:${minute} PM`;
    } else if (parsedHour > 12) {
        return `${parsedHour - 12}:${minute} PM`;
    } else {
        return `${hour}:${minute} AM`;
    }
};