
import React from 'react';
import type { StressTrack } from '../types';
import { MinusIcon, PlusIcon } from './Icon';

interface StressTrackProps {
  label: string;
  track: StressTrack;
  onUpdate: (newTrack: StressTrack) => void;
}

const StressTrackComponent: React.FC<StressTrackProps> = ({ label, track, onUpdate }) => {
  const handleCheck = (index: number) => {
    const newChecked = [...track.checked];
    newChecked[index] = !newChecked[index];
    onUpdate({ ...track, checked: newChecked });
  };

  const changeBoxCount = (amount: number) => {
    const newBoxCount = Math.max(1, track.boxes + amount);
    const newChecked = Array(newBoxCount).fill(false).map((val, i) => track.checked[i] || val);
    onUpdate({ boxes: newBoxCount, checked: newChecked });
  };

  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 flex-wrap">
        <h4 className="text-sm uppercase font-bold w-20 flex-shrink-0">{label} Stress:</h4>
        <div className="flex items-center gap-1 flex-grow">
          {track.checked.map((isChecked, index) => (
            <button
              key={index}
              onClick={() => handleCheck(index)}
              className={`w-7 h-7 border-2 flex-shrink-0 ${isChecked ? 'bg-red-500 border-red-600' : 'bg-transparent border-black'}`}
              aria-label={`${label} Stress box ${index + 1}`}
            >
              {isChecked && <span className="text-black font-black text-xl">X</span>}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
            <button onClick={() => changeBoxCount(1)} className="p-0.5 border border-gray-500 text-gray-500 hover:text-black hover:border-black"><PlusIcon className="h-4 w-4" /></button>
            <button onClick={() => changeBoxCount(-1)} className="p-0.5 border border-gray-500 text-gray-500 hover:text-black hover:border-black"><MinusIcon className="h-4 w-4"/></button>
        </div>
      </div>
    </div>
  );
};

export default StressTrackComponent;
