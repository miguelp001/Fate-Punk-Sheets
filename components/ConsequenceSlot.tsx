import React, { useState } from 'react';
import type { Consequences } from '../types';

interface ConsequenceSlotProps {
  consequences: Consequences;
  onUpdate: (newConsequences: Consequences) => void;
}

interface EditableConsequenceProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
}

const EditableConsequence: React.FC<EditableConsequenceProps> = ({ label, value, onSave }) => {
    const [currentValue, setCurrentValue] = useState(value);

    const handleBlur = () => {
        if (currentValue !== value) {
            onSave(currentValue);
        }
    };
    
    return (
        <div className="grid grid-cols-[90px_1fr] items-center gap-2">
            <span className="text-xs uppercase font-bold text-right">{label}:</span>
            <input
                type="text"
                value={currentValue}
                placeholder="[ NO TRAUMA ]"
                onChange={(e) => setCurrentValue(e.target.value)}
                onBlur={handleBlur}
                className="w-full bg-transparent border-b border-dotted border-gray-500 focus:outline-none focus:border-black py-0.5 text-black text-sm"
            />
        </div>
    );
};


const ConsequenceSlot: React.FC<ConsequenceSlotProps> = ({ consequences, onUpdate }) => {

  const handleSave = (key: keyof Consequences, value: string) => {
    onUpdate({ ...consequences, [key]: value });
  };

  return (
    <div className="mt-2">
      <h4 className="text-sm uppercase font-bold mb-2">Consequences</h4>
      <div className="space-y-1">
        <EditableConsequence label="Mild (-2)" value={consequences.mild} onSave={val => handleSave('mild', val)} />
        <EditableConsequence label="Moderate (-4)" value={consequences.moderate} onSave={val => handleSave('moderate', val)} />
        <EditableConsequence label="Severe (-6)" value={consequences.severe} onSave={val => handleSave('severe', val)} />
      </div>
    </div>
  );
};

export default ConsequenceSlot;
