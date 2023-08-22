export function formatTime(millisecond: number) {
    return `${(millisecond / 1000 - millisecond / 1000 % 60) / 60}:${Math.round(millisecond / 1000 % 60).toString().padStart(2, '0')}`
}