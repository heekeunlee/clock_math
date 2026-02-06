
import { CENTER, getCoordinates } from '../utils/clockUtils';

interface AngleArcProps {
    minuteAngle: number;
    hourAngle: number;
    radius?: number;
}

export const AngleArc = ({ minuteAngle, hourAngle, radius = 50 }: AngleArcProps) => {
    // Normalize angles to 0-360
    const m = minuteAngle % 360;
    const h = hourAngle % 360;

    // Calculate start and end points
    const start = getCoordinates(h, radius);
    const end = getCoordinates(m, radius);

    // Determine direction
    // CW path from H to M
    const cwDiff = (m - h + 360) % 360;
    // CCW path from H to M
    const ccwDiff = (h - m + 360) % 360;

    // We want the shorter path
    const sweepFlag = cwDiff <= ccwDiff ? 1 : 0;

    // Large arc flag is 0 because we want the smaller angle (<180)
    // (Unless they are exactly 180, then it divides equally, 0 works)

    return (
        <>
            <path
                d={`M ${CENTER.x} ${CENTER.y} L ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${sweepFlag} ${end.x} ${end.y} Z`}
                fill="rgba(126, 211, 33, 0.4)"
                stroke="#7ED321"
                strokeWidth="2"
                className="pointer-events-none transition-all duration-75"
            />
            {/* Draw a helper circle at the point to smooth joints? Not needed */}
        </>
    );
};
