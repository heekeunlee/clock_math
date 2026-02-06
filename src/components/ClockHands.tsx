
import React, { useRef, useEffect } from 'react';
import { CENTER, getCoordinates } from '../utils/clockUtils';

interface ClockHandsProps {
    totalMinutes: number;
    setTotalMinutes: (val: number | ((prev: number) => number)) => void;
}

export const ClockHands = ({ totalMinutes, setTotalMinutes }: ClockHandsProps) => {
    // Lengths
    const MINUTE_HAND_LENGTH = 130;
    const HOUR_HAND_LENGTH = 80;

    // Angles
    const minuteAngle = (totalMinutes % 60) * 6;
    const hourAngle = (totalMinutes / 60) * 30; // 0.5 deg per minute

    const isDragging = useRef(false);
    const svgRef = useRef<SVGGElement>(null);

    // Previous angle tracking to handle full rotations
    const lastAngle = useRef(minuteAngle);

    // Drag handlers
    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        isDragging.current = true;
        (e.target as Element).setPointerCapture(e.pointerId);
        handlePointerMove(e);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return;

        // Calculate new angle relative to center
        // We need to access the parent SVG's coordinate system or just usage client rect
        // assuming SVG is full screen or we have bounds.
        // Simpler: use client coordinates vs center of SVG element.
        const svgBounds = svgRef.current?.ownerSVGElement?.getBoundingClientRect();
        if (!svgBounds) return;

        // Center in client coordinates
        // SVG is 400x400 viewbox. If responsive, we need scaling factor.
        const scaleX = 400 / svgBounds.width;
        const scaleY = 400 / svgBounds.height;

        // Mouse Pos in SVG coords
        const mouseX = (e.clientX - svgBounds.left) * scaleX;
        const mouseY = (e.clientY - svgBounds.top) * scaleY;

        // Angle from center
        const dx = mouseX - CENTER.x;
        const dy = mouseY - CENTER.y;

        let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        // atan2 returns -180 to 180. +90 rotates 0 to 12 o'clock.

        if (deg < 0) deg += 360;

        // Snap to nearest 6 degrees (minute) for easier reading? Or smooth?
        // User asked "User rotates minute hand". Smooth is nicer visually, but discrete minutes are easier for "Clock".
        // Let's do integer minutes for simplicity of calculation questions.
        const constrainedDeg = Math.round(deg / 6) * 6;

        // Determining delta to handle 12-hour wrapping
        let current = constrainedDeg;
        let prev = lastAngle.current % 360;

        // Handle wrap around
        // If we jump from 354 to 6 -> +12 (crossed 12)
        // If we jump from 6 to 354 -> -12

        let delta = current - prev;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        if (delta !== 0) {
            // Calculate minutes change
            // 6 degrees = 1 minute
            const minChange = Math.round(delta / 6);
            setTotalMinutes(m => {
                const newM = m + minChange;
                return newM < 0 ? newM + 720 : newM; // basic non-negative wrap? or allow negative?
                // usually clocks cycle 0-720 (12 hours).
                // Let's modulo 720 to stay in simplified range if we don't care about day/night
                // return (newM + 7200) % 720;
            });
            lastAngle.current = current;
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        isDragging.current = false;
        (e.target as Element).releasePointerCapture(e.pointerId);
    };

    // Sync ref when props change externally (not by drag)
    useEffect(() => {
        if (!isDragging.current) {
            lastAngle.current = minuteAngle;
        }
    }, [minuteAngle]);

    const minuteCoords = getCoordinates(minuteAngle, MINUTE_HAND_LENGTH);
    const hourCoords = getCoordinates(hourAngle, HOUR_HAND_LENGTH);

    return (
        <g ref={svgRef} className="cursor-pointer select-none">
            {/* Hour Hand */}
            <line
                x1={CENTER.x}
                y1={CENTER.y}
                x2={hourCoords.x}
                y2={hourCoords.y}
                stroke="#4A90E2" // Brand Blue
                strokeWidth="8"
                strokeLinecap="round"
            />

            {/* Minute Hand */}
            <g
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="cursor-grab active:cursor-grabbing"
            >
                {/* Extended invisible hit area for easier grabbing */}
                <line
                    x1={CENTER.x}
                    y1={CENTER.y}
                    x2={minuteCoords.x}
                    y2={minuteCoords.y}
                    stroke="transparent"
                    strokeWidth="40"
                    strokeLinecap="round"
                />

                {/* Visual Hand */}
                <line
                    x1={CENTER.x}
                    y1={CENTER.y}
                    x2={minuteCoords.x}
                    y2={minuteCoords.y}
                    stroke="#F5A623" // Brand Orange
                    strokeWidth="6"
                    strokeLinecap="round"
                />

                {/* Knob at the end */}
                <circle
                    cx={minuteCoords.x}
                    cy={minuteCoords.y}
                    r={12}
                    fill="#F5A623"
                    stroke="white"
                    strokeWidth="3"
                    className="shadow-sm"
                />
            </g>

            {/* Center Pin */}
            <circle cx={CENTER.x} cy={CENTER.y} r={6} fill="#334155" />
        </g>
    );
};
