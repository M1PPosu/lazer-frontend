export interface ServerStats {
  registered_users: number;
  online_users: number;
  playing_users: number;
  timestamp: string;
}

export interface OnlineHistoryEntry {
  timestamp: string;
  online_count: number;
  playing_count: number;
}

export interface OnlineHistoryResponse {
  history: OnlineHistoryEntry[];
  current_stats: ServerStats;
}
