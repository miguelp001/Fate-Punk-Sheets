import React, { useState, useCallback, useEffect, Suspense } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import type { Character } from './types';
import { createDefaultCharacter } from './constants';
import { PlusIcon, TrashIcon } from './components/Icon';

const CharacterSheet = React.lazy(() => import('./components/CharacterSheet'));

const App: React.FC = () => {
  const [characters, setCharacters] = useLocalStorage<Character[]>('fate-characters', []);
  const [activeCharacterId, setActiveCharacterId] = useLocalStorage<string | null>('fate-last-active-char', null);

  useEffect(() => {
    if (activeCharacterId && !characters.find(c => c.id === activeCharacterId)) {
      const newActiveId = characters.length > 0 ? characters[0].id : null;
      setActiveCharacterId(newActiveId);
    } else if (!activeCharacterId && characters.length > 0) {
        setActiveCharacterId(characters[0].id);
    }
  }, [characters, activeCharacterId, setActiveCharacterId]);

  const selectCharacter = (id: string) => {
    setActiveCharacterId(id);
  };
  
  const addCharacter = () => {
    const newChar = createDefaultCharacter();
    setCharacters((prev: Character[]) => [...prev, newChar]);
    selectCharacter(newChar.id);
  };

  const deleteCharacter = (idToDelete: string) => {
    setCharacters((prev: Character[]) => prev.filter((c: Character) => c.id !== idToDelete));
  };

  const updateCharacter = useCallback((updatedChar: Character) => {
    setCharacters((prev: Character[]) => prev.map((c: Character) => (c.id === updatedChar.id ? updatedChar : c)));
  }, [setCharacters]);

  const activeCharacter = characters.find(c => c.id === activeCharacterId);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-4 border-dashed border-red-500 pb-4">
        <div>
           <h1 className="text-4xl lg:text-5xl font-black uppercase punk-title text-white">
             Fate Core Sheets
           </h1>
            <div className="tape mt-2 ml-1">
                <p className="text-black text-sm">Your City, Your Rules</p>
            </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5 bg-zinc-800 bg-opacity-80 backdrop-blur-sm border-2 border-black p-4">
          <h2 className="report-header text-3xl text-red-500 border-b-2 border-dashed border-red-500 pb-2 mb-4">CASE FILES</h2>
          <ul className="space-y-2 mb-4">
            {characters.map(char => (
              <li key={char.id} className="flex justify-between items-center group">
                <button
                  onClick={() => selectCharacter(char.id)}
                  className={`w-full text-left text-lg uppercase px-2 py-1 transition-all duration-200 font-bold ${activeCharacterId === char.id ? 'bg-red-600 text-white' : 'hover:bg-zinc-700'}`}
                >
                  {char.name}
                </button>
                <button onClick={() => deleteCharacter(char.id)} className="ml-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all">
                   <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
          <button onClick={addCharacter} className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-2 px-4 uppercase text-lg border-2 border-black hover:bg-red-500 hover:text-white transition-colors duration-200">
            <PlusIcon /> New File
          </button>
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          {activeCharacter ? (
            <Suspense fallback={<div className="text-center text-xl p-8">Loading character sheet...</div>}>
              <CharacterSheet key={activeCharacter.id} character={activeCharacter} onUpdate={updateCharacter} />
            </Suspense>
          ) : (
            <div className="flex flex-col items-center justify-center h-full border-4 border-dashed border-white p-10 text-center bg-black bg-opacity-50">
              <div className="stamp stamp-large text-red-500 border-red-500 mb-8">FILE NOT FOUND</div>
              <h2 className="text-4xl uppercase report-header text-white">No Active Subject</h2>
              <p className="text-xl mt-4">System alert: No case file selected or available.</p>
              <p className="mt-2">Create a 'New File' to begin surveillance.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;