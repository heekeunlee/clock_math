
export const CLOCK_RADIUS = 150;
export const CENTER = { x: 200, y: 200 }; // Viewport of 400x400

export const totalMinutesToTime = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    // 12-hour format adjustment
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return {
        hours,
        minutes,
        displayHour,
        displayTime: `${displayHour}:${minutes.toString().padStart(2, '0')}`
    };
};

export const getHandAngle = (value: number, total: number) => {
    return (value / total) * 360;
};

// Returns coordinates for an SVG line end point
export const getCoordinates = (angleDegrees: number, radius: number) => {
    // SVG coordinate system: 0 degrees is usually 3 o'clock. 
    // But clock 0 is 12 o'clock (-90 degrees offset in standard trig).
    const angleRadians = (angleDegrees - 90) * (Math.PI / 180);
    return {
        x: CENTER.x + radius * Math.cos(angleRadians),
        y: CENTER.y + radius * Math.sin(angleRadians),
    };
};

export const calculateSmallestAngle = (minuteAngle: number, hourAngle: number) => {
    const diff = Math.abs(minuteAngle - hourAngle) % 360;
    return Math.min(diff, 360 - diff);
};

export const normalizeAngle = (angle: number) => {
    let normalized = angle % 360;
    if (normalized < 0) normalized += 360;
    return normalized;
};
