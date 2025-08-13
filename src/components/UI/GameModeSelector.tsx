import React from 'react';
import type { GameMode } from '../../types';
import { GAME_MODE_NAMES, GAME_MODE_COLORS } from '../../types';

interface GameModeSelectorProps {
  selectedMode?: GameMode;
  onModeChange: (mode: GameMode) => void;
  className?: string;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  selectedMode,
  onModeChange,
  className = '',
}) => {
  const modes: GameMode[] = ['osu', 'taiko', 'fruits', 'mania', 'osurx', 'osuap'];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 ${className}`}>
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={`relative px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 border-2 ${
            selectedMode === mode
              ? 'text-white shadow-lg border-transparent'
              : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600'
          }`}
          style={{
            backgroundColor: selectedMode === mode ? GAME_MODE_COLORS[mode] : undefined,
            borderColor: selectedMode === mode ? GAME_MODE_COLORS[mode] : undefined,
          }}
        >
          {selectedMode === mode && (
            <div 
              className="absolute inset-0 rounded-xl opacity-20"
              style={{ backgroundColor: GAME_MODE_COLORS[mode] }}
            />
          )}
          <span className="relative z-10">{GAME_MODE_NAMES[mode]}</span>
        </button>
      ))}
    </div>
  );
};

export default GameModeSelector;
