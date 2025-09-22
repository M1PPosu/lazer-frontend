export interface UserActivity {
  id: number;
  createdAt: string;
  type:
    | 'rank'
    | 'rank_lost'
    | 'achievement'
    | 'beatmapset_upload'
    | 'beatmapset_approve'
    | 'beatmapset_delete'
    | 'beatmapset_revive'
    | 'beatmapset_update'
    | 'username_change'
    | 'user_support_again'
    | 'user_support_first'
    | 'user_support_gift'
    | 'userpageUpdate';
  scorerank?: string;
  rank?: number;
  mode?: string;
  beatmap?: {
    title: string;
    url: string;
  };
  beatmapset?: {
    title: string;
    url: string;
  };
  user: {
    username: string;
    url: string;
  };
  achievement?: {
    name: string;
    slug: string;
    achievement_id?: number;
    achieved_at?: string;
    icon_url?: string;
    id?: number;
    grouping?: string;
    ordering?: number;
    description?: string;
    mode?: string | null;
    instructions?: string | null;
  };
}

export interface UserRecentActivityResponse {
  activities: UserActivity[];
  has_more: boolean;
  total: number;
}
