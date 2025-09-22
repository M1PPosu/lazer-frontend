export type GameMode = 'osu' | 'taiko' | 'fruits' | 'mania' | 'osurx' | 'osuap' | 'taikorx' | 'fruitsrx';

export type MainGameMode = 'osu' | 'taiko' | 'fruits' | 'mania';

export const GAME_MODE_GROUPS: Record<MainGameMode, GameMode[]> = {
  osu: ['osu', 'osurx', 'osuap'],
  taiko: ['taiko', 'taikorx'],
  fruits: ['fruits', 'fruitsrx'],
  mania: ['mania'],
};

export const GAME_MODE_NAMES: Record<GameMode, string> = {
  osu: 'Standard',
  osurx: 'Relax',
  osuap: 'Auto Pilot',
  taiko: 'Taiko',
  taikorx: 'Taiko RX',
  fruits: 'Catch',
  fruitsrx: 'Catch RX',
  mania: 'Mania',
};

export const GAME_MODE_COLORS: Record<GameMode, string> = {
  osu: '#ED8EA6',
  osurx: '#ED8EA6',
  osuap: '#ED8EA6',
  taiko: '#7DD5D4',
  taikorx: '#7DD5D4',
  fruits: '#7DD5D4',
  fruitsrx: '#7DD5D4',
  mania: '#ED8EA6',
};

export type Theme = 'light' | 'dark';

export const MAIN_MODE_ICONS: Record<MainGameMode, string> = {
  osu: 'fa-extra-mode-osu',
  taiko: 'fa-extra-mode-taiko',
  fruits: 'fa-extra-mode-fruits',
  mania: 'fa-extra-mode-mania',
};
