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
  priv?: number;
  avatar_url?: string;
  cover_url?: string;
  cover?: {
    url: string;
  };
  is_active: boolean;
  is_bot: boolean;
  pm_friends_only: boolean;
  profile_colour?: string | null;
  page?: {
    html: string;
    raw: string;
  };
  previous_usernames: string[];
  badges: any[];
  is_restricted: boolean;
  beatmap_playcounts_count: number;
  playmode: string;
  discord?: string | null;
  has_supported: boolean;
  interests?: string | null;
  location?: string | null;
  max_blocks: number;
  max_friends: number;
  occupation?: string | null;
  playstyle: string[];
  profile_hue?: number | null;
  profile_order: string[];
  title?: string | null;
  title_url?: string | null;
  twitter?: string | null;
  website?: string | null;
  comments_count: number;
  post_count: number;
  is_admin: boolean;
  is_gmt: boolean;
  is_qat: boolean;
  is_bng: boolean;
  is_online: number;
  groups: any[];
  country: {
    code: string;
    name: string;
  };
  favourite_beatmapset_count: number;
  graveyard_beatmapset_count: number;
  guest_beatmapset_count: number;
  loved_beatmapset_count: number;
  mapping_follower_count: number;
  nominated_beatmapset_count: number;
  pending_beatmapset_count: number;
  ranked_beatmapset_count: number;
  follow_user_mapping: any[];
  follower_count: number;
  friends?: any;
  scores_best_count: number;
  scores_first_count: number;
  scores_recent_count: number;
  scores_pinned_count: number;
  account_history: any[];
  active_tournament_banners: any[];
  kudosu: {
    available: number;
    total: number;
  };
  monthly_playcounts: {
    start_date: string;
    count: number;
  }[];
  replay_watched_counts: any[];
  unread_pm_count: number;
  rank_history?: {
    mode: string;
    data: number[];
  };
  rank_highest?: {
    rank: number;
    updated_at: string;
  };
  statistics?: UserStatistics;
  statistics_rulesets?: {
    [key: string]: UserStatistics;
  };
  user_achievements: any[];
  team?: any;
  session_verified: boolean;
  daily_challenge_user_stats?: {
    daily_streak_best: number;
    daily_streak_current: number;
    last_update?: string | null;
    last_weekly_streak?: any;
    playcount: number;
    top_10p_placements: number;
    top_50p_placements: number;
    weekly_streak_best: number;
    weekly_streak_current: number;
    user_id: number;
  };
}

export interface UserStatistics {
  mode: GameMode;
  user_id?: number;
  count_300?: number;
  count_100?: number;
  count_50?: number;
  count_miss?: number;
  total_score?: number;
  ranked_score?: number;
  pp?: number;
  hit_accuracy?: number;
  play_count?: number;
  play_time?: number;
  total_hits?: number;
  maximum_combo?: number;
  replays_watched?: number;
  replays_watched_by_others?: number;
  is_ranked?: boolean;
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
  global_rank?: number | null;
  country_rank?: number | null;
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
  osu: '#ED8EA6',
  taiko: '#7DD5D4',
  fruits: '#7DD5D4',
  mania: '#ED8EA6',
  osurx: '#ED8EA6',
  osuap: '#7DD5D4',
};
