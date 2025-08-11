// Game modes
export type GameMode = 'osu' | 'taiko' | 'fruits' | 'mania' | 'osurx' | 'osuap';

// User types
export interface User {
  id: number;
  username: string;
  email?: string;
  country_code: string;
  join_date: string;
  last_visit: string;
  is_supporter: boolean;
  support_level: number;
  priv: number;
  avatar_url?: string;
  cover_url?: string;
  statistics?: UserStatistics;
}

export interface UserStatistics {
  mode: GameMode;
  user_id: number;
  count_300?: number;
  count_100?: number;
  count_50?: number;
  count_miss?: number;
  total_score?: number;
  ranked_score?: number;
  pp?: number;
  accuracy?: number;
  play_count?: number;
  play_time?: number;
  total_hits?: number;
  maximum_combo?: number;
  replays_watched?: number;
  grade_counts?: {
    ssh: number;
    ss: number;
    sh: number;
    s: number;
    a: number;
  };
  level?: {
    current: number;
    progress: number;
  };
  global_rank?: number;
  country_rank?: number;
}

// Auth types
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Error types
export interface ApiError {
  error: string;
  error_description: string;
  hint: string;
  message: string;
}

export interface RegistrationError {
  form_error: {
    user: {
      username?: string[];
      user_email?: string[];
      password?: string[];
    };
    message?: string;
  };
}

// UI types
export interface NavItem {
  path: string;
  title: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  requireAuth?: boolean;
}

// Theme types
export type Theme = 'light' | 'dark';

// Game mode display names and colors
export const GAME_MODE_NAMES: Record<GameMode, string> = {
  osu: 'osu!',
  taiko: 'osu!taiko',
  fruits: 'osu!catch',
  mania: 'osu!mania',
  osurx: 'osu!rx',
  osuap: 'osu!ap',
};

export const GAME_MODE_COLORS: Record<GameMode, string> = {
  osu: '#ff66aa',
  taiko: '#ff6600',
  fruits: '#66ccff',
  mania: '#8866ee',
  osurx: '#9966ff',
  osuap: '#33ff66',
};
