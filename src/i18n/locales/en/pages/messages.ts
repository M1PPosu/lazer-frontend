export const messagesPage = {
  messages: {
    title: 'Messages',
    tabs: {
      channels: 'Channels',
      notifications: 'Notifications',
    },
    channels: {
      general: 'General',
      osu: 'osu!',
      taiko: 'osu!taiko',
      fruits: 'osu!catch',
      mania: 'osu!mania',
    },
    chat: {
      placeholder: 'Type a message...',
      send: 'Send',
      online: 'Online',
      offline: 'Offline',
      typing: 'Typing...',
    },
    notifications: {
      markAllRead: 'Mark all as read',
      refresh: 'Refresh',
      empty: 'No notifications',
      types: {
        friend_request: 'Friend Request',
        team_invite: 'Team Invitation',
        system: 'System Notification',
      },
    },
    privateMessage: {
      title: 'Private Message',
      newMessage: 'New Message',
      sendTo: 'Send to',
      close: 'Close',
    },
    errors: {
      loadFailed: 'Failed to load messages',
      sendFailed: 'Failed to send message',
      connectFailed: 'Connection failed',
    },
  },
} as const;
