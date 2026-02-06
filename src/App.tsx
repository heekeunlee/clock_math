
import { useState } from 'react';
import { totalMinutesToTime, calculateSmallestAngle } from './utils/clockUtils';
import { ClockFace } from './components/ClockFace';
import { ClockHands } from './components/ClockHands';
import { AngleArc } from './components/AngleArc';
import clsx from 'clsx';
import { Eye, EyeOff, Shuffle, RotateCcw } from 'lucide-react';

function App() {
  const [totalMinutes, setTotalMinutes] = useState(3 * 60); // Start at 3:00
  const [showAngle, setShowAngle] = useState(true);

  // Calculate angles
  const minuteAngle = (totalMinutes % 60) * 6;
  const hourAngle = (totalMinutes % 720) * 0.5;
  const angle = calculateSmallestAngle(minuteAngle, hourAngle);

  // Normalize time for display
  const normalizedTotalMinutes = (totalMinutes % 720 + 720) % 720;
  const { displayTime } = totalMinutesToTime(normalizedTotalMinutes);

  const handleRandomize = () => {
    // Random minute multiple of 5 usually for 3rd grade? Or any?
    // Let's do multiple of 5 for simpler angles first, or just random integer.
    // Random 0-719
    const randomMin = Math.floor(Math.random() * 720);
    setTotalMinutes(randomMin);
  };

  const handleReset = () => {
    setTotalMinutes(3 * 60);
    setShowAngle(true);
  };

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center p-4 font-rounded text-slate-700 selection:bg-brand-orange/30">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-brand-blue drop-shadow-sm tracking-tight text-center">
        시계 각도 놀이 <span className="text-xl md:text-2xl block mt-1 text-sky-600 font-medium">Clock Angle Playground</span>
      </h1>

      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl flex flex-col items-center gap-8 relative border-[6px] border-brand-orange/20 max-w-2xl w-full">

        {/* Clock SVG Container */}
        <div className="relative group">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 400"
            className="w-[280px] h-[280px] md:w-[380px] md:h-[380px] touch-none select-none drop-shadow-xl"
          >
            <ClockFace />
            {showAngle && <AngleArc minuteAngle={minuteAngle} hourAngle={hourAngle} radius={80} />}
            <ClockHands totalMinutes={totalMinutes} setTotalMinutes={setTotalMinutes} />
          </svg>
        </div>

        {/* Controls & Display */}
        <div className="flex flex-col gap-6 w-full px-2 md:px-8">

          {/* Info Cards */}
          <div className="flex gap-4 text-2xl md:text-3xl font-bold justify-center">
            <div className="flex-1 bg-sky-100 flex flex-col items-center py-3 rounded-2xl border-b-[5px] border-sky-300 transition-transform active:scale-95">
              <span className="text-xs text-sky-600 uppercase tracking-wilder font-bold mb-1">시간 (Time)</span>
              <div className="flex items-center gap-2 font-mono text-sky-700">
                {displayTime}
              </div>
            </div>

            <div className={clsx(
              "flex-1 flex flex-col items-center py-3 rounded-2xl border-b-[5px] transition-all duration-300 cursor-pointer active:scale-95",
              showAngle ? "bg-brand-green/10 border-brand-green/40 text-brand-green" : "bg-slate-100 border-slate-300 text-slate-400"
            )} onClick={() => setShowAngle(!showAngle)}>
              <span className="text-xs uppercase tracking-wider font-bold mb-1">각도 (Angle)</span>
              <div className="flex items-center gap-2">
                {showAngle ? `${Math.round(angle * 10) / 10}°` : '???°'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRandomize}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-orange text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-brand-orange/30 hover:bg-yellow-500 active:translate-y-1 transition-all"
            >
              <Shuffle size={20} />
              문제 내기
            </button>
            <button
              onClick={() => setShowAngle(!showAngle)}
              className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 active:translate-y-1 transition-all"
            >
              {showAngle ? <EyeOff size={20} /> : <Eye size={20} />}
              {showAngle ? '정답 숨기기' : '정답 보기'}
            </button>
            <button
              onClick={handleReset}
              className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 active:translate-y-1 transition-all"
              aria-label="Reset"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <p className="text-slate-400 text-sm font-medium text-center bg-slate-50 px-4 py-2 rounded-full">
          💡 팁: 분침을 돌려보거나 "문제 내기"를 눌러 각도를 맞춰보세요!
        </p>
      </div>
    </div>
  );
}

export default App;
