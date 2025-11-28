import type { User } from './user';

export type ChannelType =
  | 'PUBLIC'
  | 'PRIVATE'
  | 'MULTIPLAYER'
  | 'SPECTATOR'
  | 'TEMPORARY'
  | 'PM'
  | 'GROUP'
  | 'SYSTEM'
  | 'ANNOUNCE'
  | 'TEAM';

export interface ChatUserAttributes {
  can_message: boolean;
  can_message_error?: string;
  last_read_id: number;
}

export interface ChatMessage {
  message_id: number;
  channel_id: number;
  content: string;
  timestamp: string;
  sender_id: number;
  sender?: User;
  is_action: boolean;
  uuid?: string;
}

export interface ChatChannel {
  channel_id: number;
  name: string;
  description: string;
  icon?: string;
  type: ChannelType;
  moderated: boolean;
  uuid?: string;
  current_user_attributes?: ChatUserAttributes;
  last_read_id?: number;
  last_message_id?: number;
  recent_messages: ChatMessage[];
  users: number[];
  message_length_limit: number;
  user_info?: {
    id: number;
    username: string;
    avatar_url: string;
    cover_url: string;
  };
}

export interface ChatMessageRequest {
  message: string;
  is_action?: boolean;
  uuid?: string;
}

export interface PrivateMessageRequest {
  target_id: number;
  message: string;
  is_action?: boolean;
  uuid?: string;
}

export interface PrivateMessageResponse {
  channel: ChatChannel;
  message: ChatMessage;
}

export interface NewPrivateMessageResponse {
  channel: ChatChannel;
  message: ChatMessage;
  new_channel_id: number;
}
