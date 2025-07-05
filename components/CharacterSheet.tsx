import React, { useState, useRef, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { Character, Skill } from '../types';
import StressTrack from './StressTrack';
import ConsequenceSlot from './ConsequenceSlot';
import { MinusIcon, PlusIcon, DownloadIcon } from './Icon';

interface CharacterSheetProps {
  character: Character;
  onUpdate: (character: Character) => void;
}

const ReportHeader: React.FC = () => (
    <div className="relative flex justify-between items-start border-b-4 border-black pb-2 mb-6">
      <div>
        <h2 className="report-header text-3xl">ANARCHY DISTRICT P.D.</h2>
        <p className="report-header text-xl">FATE CORE DIVISION</p>
      </div>
      <div className="stamp absolute top-0 right-0 -mt-2 sm:mt-0">
        CLASSIFIED
      </div>
    </div>
);

const SectionHeader: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <h3 className="report-header text-xl tracking-wider border-b-2 border-black mb-4 pb-1">{children}</h3>
);

const FormRow: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
    <div className={`grid grid-cols-[90px_1fr] sm:grid-cols-[120px_1fr] items-start gap-2 mb-3 ${className}`}>
        <label className="text-sm font-bold uppercase text-right mt-2">{label}:</label>
        <div className="w-full">{children}</div>
    </div>
);

const FormInput: React.FC<{ value: string; onSave: (newValue: string) => void; isTextArea?: boolean; rows?: number }> = ({ value, onSave, isTextArea, rows }) => {
    const [currentValue, setCurrentValue] = useState(value);
    const handleBlur = () => onSave(currentValue);
    
    const commonProps = {
        value: currentValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCurrentValue(e.target.value),
        onBlur: handleBlur,
        className: "w-full bg-transparent focus:outline-none text-black text-lg border-b-2 border-dotted border-gray-400 focus:border-solid focus:border-black",
    };

    if (isTextArea) {
        return <textarea {...commonProps} rows={rows || 2}></textarea>;
    }
    return <input type="text" {...commonProps} />;
};


const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onUpdate }) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExportToPdf = async () => {
    const sheetElement = sheetRef.current;
    if (!sheetElement) return;

    setIsExporting(true);

    try {
        const canvas = await html2canvas(sheetElement, {
            scale: 2, // Higher resolution
            backgroundColor: '#f5f5f4', // Tailwind's bg-stone-100
            useCORS: true,
            // Add scroll context to ensure the entire element is captured
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight,
        });

        const imgData = canvas.toDataURL('image/png');
        if (!imgData || imgData === 'data:,') {
            throw new Error("Failed to capture character sheet image. The canvas was empty.");
        }
        
        // A4 page size in mm: 210 x 297
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Use canvas dimensions directly for a more reliable aspect ratio
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
        
        const finalImgWidth = canvasWidth * ratio;
        const finalImgHeight = canvasHeight * ratio;
        
        // Center the image on the page
        const x = (pdfWidth - finalImgWidth) / 2;
        const y = (pdfHeight - finalImgHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, finalImgWidth, finalImgHeight);
        pdf.save(`${character.name.replace(/\s/g, '_')}_case_file.pdf`);
    } catch (error) {
        console.error("Error exporting to PDF:", error);
        alert("Sorry, there was an error exporting your character sheet. Please check the console for details.");
    } finally {
        setIsExporting(false);
    }
  };


  const handleUpdate = <K extends keyof Character,>(key: K, value: Character[K]) => {
    onUpdate({ ...character, [key]: value });
  };
  
  const handleAspectChange = (index: number, value: string) => {
    const newAspects = [...character.aspects];
    newAspects[index] = value;
    handleUpdate('aspects', newAspects);
  };

  const handleSkillChange = (skillName: string, level: number) => {
    const newSkills = character.skills.map(s => s.name === skillName ? {...s, level} : s);
    handleUpdate('skills', newSkills);
  };
  
  const handleStuntChange = (index: number, value: string) => {
    const newStunts = [...character.stunts];
    newStunts[index] = value;
    handleUpdate('stunts', newStunts);
  };

  const addStunt = () => handleUpdate('stunts', [...character.stunts, ""]);
  const removeStunt = (index: number) => handleUpdate('stunts', character.stunts.filter((_, i) => i !== index));

  const sortedSkills = useMemo(() => [...character.skills].sort((a, b) => b.level - a.level), [character.skills]);

  return (
    <div>
        <div className="flex justify-end mb-4">
            <button
                onClick={handleExportToPdf}
                disabled={isExporting}
                className="flex items-center gap-2 bg-black text-white px-3 py-1 border-2 border-black hover:bg-red-500 disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors"
                aria-label="Export Character Sheet to PDF"
            >
                <DownloadIcon />
                <span className="report-header text-lg">{isExporting ? 'EXPORTING...' : 'EXPORT PDF'}</span>
            </button>
        </div>
        <div ref={sheetRef} className="bg-stone-100 text-black p-4 sm:p-6 border-2 border-black shadow-2xl font-sans">
          <ReportHeader />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
                <FormRow label="Subject"><FormInput value={character.name} onSave={val => handleUpdate('name', val)} /></FormRow>
                <FormRow label="Description"><FormInput value={character.description} onSave={val => handleUpdate('description', val)} isTextArea /></FormRow>
            </div>
            <div className="border-4 border-black p-2 text-center h-fit">
                <h3 className="report-header text-xl">REFRESH</h3>
                <div className="text-7xl font-black my-1">{character.fatePoints}</div>
                <div className="flex justify-center gap-2">
                    <button onClick={() => handleUpdate('fatePoints', character.fatePoints + 1)} className="bg-gray-200 text-black p-1 hover:bg-black hover:text-white border-2 border-black"><PlusIcon /></button>
                    <button onClick={() => handleUpdate('fatePoints', Math.max(0, character.fatePoints - 1))} className="bg-gray-200 text-black p-1 hover:bg-black hover:text-white border-2 border-black"><MinusIcon /></button>
                </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <SectionHeader>Subject Profile // Aspects</SectionHeader>
              <FormRow label="High Concept"><FormInput value={character.highConcept} onSave={val => handleUpdate('highConcept', val)} /></FormRow>
              <FormRow label="Trouble"><FormInput value={character.trouble} onSave={val => handleUpdate('trouble', val)} /></FormRow>
              {character.aspects.map((aspect, i) => (
                <FormRow key={i} label={`Aspect ${i+1}`}><FormInput value={aspect} onSave={val => handleAspectChange(i, val)} /></FormRow>
              ))}
              
              <SectionHeader>Abilities // Skills</SectionHeader>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                  {sortedSkills.map(skill => (
                    <div key={skill.name} className="flex items-center justify-between border-b border-dotted border-gray-400 py-1">
                      <span className={`uppercase font-bold ${skill.level > 0 ? 'text-black' : 'text-gray-500'}`}>{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleSkillChange(skill.name, Math.max(0, skill.level - 1))} className="text-xs p-0.5 border border-black w-5 h-5 flex items-center justify-center">-</button>
                        <span className="font-black text-red-600 w-6 text-center text-lg">{skill.level > 0 ? `+${skill.level}` : '0'}</span>
                        <button onClick={() => handleSkillChange(skill.name, Math.min(8, skill.level + 1))} className="text-xs p-0.5 border border-black w-5 h-5 flex items-center justify-center">+</button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div>
              <SectionHeader>Incidents // Stunts</SectionHeader>
                {character.stunts.map((stunt, i) => (
                     <div key={i} className="flex items-start gap-2 mb-2">
                        <FormInput value={stunt} onSave={val => handleStuntChange(i, val)} isTextArea rows={3} />
                        <button onClick={() => removeStunt(i)} className="mt-1 text-gray-600 hover:text-red-600 p-1"><MinusIcon className="h-5 w-5"/></button>
                     </div>
                ))}
                <button onClick={addStunt} className="mt-1 text-black hover:text-red-600 flex items-center gap-1 font-bold uppercase text-sm"><PlusIcon className="h-4 w-4"/> Add Stunt</button>
              
              <SectionHeader>Damage Report</SectionHeader>
              <div className="bg-gray-200 p-3 border-2 border-gray-400">
                <StressTrack 
                    label="Physical" 
                    track={character.physicalStress} 
                    onUpdate={newTrack => handleUpdate('physicalStress', newTrack)} 
                />
                <StressTrack 
                    label="Mental" 
                    track={character.mentalStress} 
                    onUpdate={newTrack => handleUpdate('mentalStress', newTrack)}
                />
                 <hr className="border-gray-400 my-3" />
                 <ConsequenceSlot 
                    consequences={character.consequences} 
                    onUpdate={newConsequences => handleUpdate('consequences', newConsequences)}
                />
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default React.memo(CharacterSheet);