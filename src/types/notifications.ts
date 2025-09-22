import type { ChatMessage } from './chat';
import type { User } from './user';

export interface APINotification {
  id: number;
  name: string;
  created_at: string;
  object_type: string;
  object_id: string;
  source_user_id?: number;
  is_read: boolean;
  details: Record<string, unknown>;
}

export interface NotificationsResponse {
  has_more: boolean;
  notifications: APINotification[];
  unread_count: number;
  notification_endpoint: string;
}

export interface UnreadCount {
  total: number;
  team_requests: number;
  private_messages: number;
  friend_requests: number;
}

export interface SocketMessage {
  event: string;
  data?: Record<string, unknown>;
  error?: string;
}

export interface ChatEvent extends SocketMessage {
  event: 'chat.message.new' | 'chat.start' | 'chat.end';
  data?: {
    messages?: ChatMessage[];
    users?: User[];
  };
}

export interface NotificationEvent extends SocketMessage {
  event: 'new_private_notification';
  data?: {
    name: string;
    object_type: string;
    object_id: number;
    source_user_id: number;
    details: Record<string, unknown>;
  };
}
