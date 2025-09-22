export const messagesPage = {
  messages: {
    title: '消息',
    tabs: {
      channels: '频道',
      notifications: '通知',
    },
    channels: {
      general: '一般',
      osu: 'osu!',
      taiko: 'osu!taiko',
      fruits: 'osu!catch',
      mania: 'osu!mania',
    },
    chat: {
      placeholder: '输入消息...',
      send: '发送',
      online: '在线',
      offline: '离线',
      typing: '正在输入...',
    },
    notifications: {
      markAllRead: '全部标记为已读',
      refresh: '刷新',
      empty: '暂无通知',
      types: {
        friend_request: '好友请求',
        team_invite: '战队邀请',
        system: '系统通知',
      },
    },
    privateMessage: {
      title: '私信',
      newMessage: '新消息',
      sendTo: '发送给',
      close: '关闭',
    },
    errors: {
      loadFailed: '加载消息失败',
      sendFailed: '发送消息失败',
      connectFailed: '连接失败',
    },
  },
} as const;
