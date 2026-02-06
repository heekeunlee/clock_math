
import { CLOCK_RADIUS, CENTER, getCoordinates } from '../utils/clockUtils';
import clsx from 'clsx';

export const ClockFace = () => {
    // Generate numbers 1-12
    const numbers = Array.from({ length: 12 }, (_, i) => i + 1);

    // Generate ticks
    const ticks = Array.from({ length: 60 }, (_, i) => i);

    return (
        <>
            {/* Clock Background */}
            <circle
                cx={CENTER.x}
                cy={CENTER.y}
                r={CLOCK_RADIUS}
                fill="white"
                stroke="#E2E8F0"
                strokeWidth="4"
                className="shadow-inner"
            />
            <circle
                cx={CENTER.x}
                cy={CENTER.y}
                r={10}
                fill="#CBD5E1"
            />

            {/* Ticks */}
            {ticks.map((tick) => {
                const isHour = tick % 5 === 0;
                const angle = tick * 6;
                const start = getCoordinates(angle, CLOCK_RADIUS - (isHour ? 0 : 5));
                const end = getCoordinates(angle, CLOCK_RADIUS - (isHour ? 20 : 10)); // Ticks length

                return (
                    <line
                        key={tick}
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        stroke={isHour ? "#94A3B8" : "#CBD5E1"}
                        strokeWidth={isHour ? 4 : 2}
                        strokeLinecap="round"
                    />
                );
            })}

            {/* Numbers */}
            {numbers.map((num) => {
                const angle = num * 30;
                // Position numbers slightly inside the ticks
                const pos = getCoordinates(angle, CLOCK_RADIUS - 40);

                return (
                    <text
                        key={num}
                        x={pos.x}
                        y={pos.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={clsx(
                            "text-3xl font-bold font-rounded fill-slate-500",
                            // Make 12, 3, 6, 9 slightly larger or distinct color if desired
                            num % 3 === 0 && "fill-brand-blue text-4xl"
                        )}
                        style={{ fontWeight: num % 3 === 0 ? 700 : 500 }}
                    >
                        {num}
                    </text>
                );
            })}
        </>
    );
};
