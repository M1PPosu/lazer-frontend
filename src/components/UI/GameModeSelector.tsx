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
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            selectedMode === mode
              ? 'text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          style={{
            backgroundColor: selectedMode === mode ? GAME_MODE_COLORS[mode] : undefined,
          }}
        >
          {GAME_MODE_NAMES[mode]}
        </button>
      ))}
    </div>
  );
};

export default GameModeSelector;
