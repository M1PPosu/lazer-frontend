export const pages = {
  // App-level pages
  app: {
    beatmapsComingSoon: '谱面（即将推出）',
    notFound: '404 - 页面未找到',
  },
  
  // Home page
  hero: {
    tagline: '可能是最好的 osu! 私服',
    description:
      'g0v0! 是一个全新的<bold>支持 lazer 客户端</bold>的 osu! 第三方服务器。提供了 standard / taiko / catch / mania 四大模式支持，支持 RX/AP pp计算与无限制改名，让你的节奏旅程更自由。',
    statusOperational: '服务正常运行中',
    statusCommunity: '加入 QQ / Discord 社区获取支持与更新',
    joinCta: '如何加入服务器',
    viewProfile: '查看资料',
    viewRankings: '查看排行榜',
    register: '注册',
    login: '登录',
    featuresTitle: '功能特色',
    featuresSubtitle: '探索我们为您提供的丰富功能和特色服务',
    community: {
      qq: 'QQ群',
      discord: 'Discord',
      github: 'GitHub',
      discordTag: '咕哦!',
    },
  },
  
  features: {
    items: [
      {
        title: '全平台支持',
        content:
          'g0v0! 专为 lazer 而打造，这意味着您可在任何支持 osu! lazer 的系统上游玩 g0v0! 而不受平台限制',
        imageAlt: '全平台支持',
      },
      {
        title: '谱面加速下载',
        content:
          '我们使用了 Sayobot 的谱面镜像加速服务来处理国内玩家的高速下载需求，让谱面下载不再漫长等待',
        imageAlt: '谱面加速下载',
      },
      {
        title: '活跃的社区支持',
        content:
          '我们拥有活跃的官方 QQ 社群和 Discord 服务器，为大家提供了一个绝佳的求助/炫耀/吹水平台',
        imageAlt: '活跃的社区支持',
      },
      {
        title: '最强客制化',
        content:
          '我们支持随意改名，上传自定义头图，以及创建花哨的个人简介和签名，在这里充分发挥您的想象力',
        imageAlt: '最强客制化',
      },
      {
        title: '开发者友好',
        content:
          '我们的服务端完全按照官方的 osu! v1/v2 API 规范设计，让您更加方便快速的接入bot/服务到 g0v0!',
        imageAlt: '开发者友好',
      },
      {
        title: '开源开放',
        content:
          '服务端/客户端全部开源免费，服务端还提供了 Hooks 支持，可通过插件来扩充服务端能力（开发中）',
        imageAlt: '开源开放',
      },
      {
        title: '允许用户谱面提交',
        content:
          '我们允许您提交自制的谱面或在官方服务器中无法计算 pp 的未上榜谱面并通过审核（开发中）',
        imageAlt: '允许用户谱面提交',
      },
      {
        title: 'rulesets排行',
        content:
          '我们支持自定义 ruleset 模式的分数计算和成绩上传，并提供完善的排行榜支持（开发中）',
        imageAlt: 'rulesets排行',
      },
    ],
  },
  
  // Rankings page
  rankings: {
    title: '排行榜',
    tabs: {
      users: '玩家排行',
      countries: '国家排行',
    },
    rankingTypes: {
      performance: '表现分',
      score: '分数',
    },
    gameModes: {
      osu: 'osu!',
      taiko: 'osu!taiko',
      fruits: 'osu!catch',
      mania: 'osu!mania',
    },
    subModes: {
      vanilla: '常规',
      relax: 'Relax',
      autopilot: 'Autopilot',
    },
    filters: {
      country: '国家/地区',
      allCountries: '全部国家',
    },
    userCard: {
      rank: '排名',
      performance: '表现分',
      accuracy: '准确率',
      playCount: '游戏次数',
      country: '国家',
    },
    countryCard: {
      rank: '排名',
      country: '国家',
      averagePerformance: '平均表现分',
      totalPerformance: '总表现分',
      activeUsers: '活跃用户',
      playCount: '次游戏',
    },
    pagination: {
      previous: '上一页',
      next: '下一页',
      page: '第 {{current}} 页 / 共 {{total}} 页',
    },
    errors: {
      loadFailed: '加载排行榜失败',
      noData: '暂无数据',
    },
  },
  
  // Settings page
  settings: {
    title: '账户设置',
    description: '管理您的账户信息和偏好设置',
    errors: {
      loadFailed: '无法加载设置',
      tryRefresh: '请尝试刷新页面'
    },
    username: {
      title: '用户名设置',
      current: '当前用户名',
      change: '修改用户名',
      placeholder: '输入新的用户名',
      hint: '用户名修改后，您的原用户名将保存在历史记录中',
      save: '保存',
      saving: '保存中...',
      cancel: '取消',
      success: '用户名修改成功！',
      errors: {
        empty: '用户名不能为空',
        sameAsOld: '新用户名与当前用户名相同',
        taken: '用户名已被占用，请选择其他用户名',
        userNotFound: '找不到指定用户',
        failed: '修改用户名失败，请稍后重试'
      }
    },
    avatar: {
      title: '头像设置',
      current: '当前头像',
      change: '修改头像',
      hint: '支持 PNG、JPEG、GIF 格式，建议尺寸 256x256 像素，最大 5MB',
      success: '头像修改成功！'
    },
    cover: {
      title: '头图设置',
      label: '个人资料头图',
      hint: '建议尺寸：2000x500 像素（官方推荐 4:1 比例），支持 PNG、JPEG、GIF 格式，最大 10MB'
    },
    account: {
      title: '账户信息',
      userId: '用户 ID',
      joinDate: '注册时间',
      country: '国家/地区',
      lastVisit: '最后访问'
    }
  },
  
  // Teams page
  teams: {
    title: '战队',
    tabs: {
      teams: '战队排行',
    },
    createTeam: '创建战队',
    myTeam: '我的战队',
    joinTeam: '加入战队',
    viewTeam: '查看战队',
    editTeam: '编辑战队',
    teamRankings: '战队排行榜',
    gameModes: {
      osu: 'osu!',
      taiko: 'osu!taiko',
      fruits: 'osu!catch',
      mania: 'osu!mania',
    },
    rankingTypes: {
      performance: '表现分',
      score: '分数',
    },
    subModes: {
      vanilla: '常规',
      relax: 'Relax',
      autopilot: 'Autopilot',
    },
    teamCard: {
      rank: '排名',
      members: '成员',
      captain: '队长',
      averageRank: '平均排名',
      totalPerformance: '总表现分',
      country: '国家',
    },
    pagination: {
      previous: '上一页',
      next: '下一页',
      page: '第 {{current}} 页 / 共 {{total}} 页',
    },
    errors: {
      loadFailed: '加载战队失败',
      noData: '暂无战队数据',
    },
  },
  
  // Messages page
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
  
  // Profile/User pages
  profile: {
    errors: {
      loadFailed: '无法加载个人资料',
      userNotFound: '用户未找到',
      checkId: '请检查用户 ID 或用户名是否正确',
      tryRefresh: '请尝试刷新页面',
    },
  },
  
  // How to join page
  howToJoin: {
    title: '如何加入服务器',
    subtitle: '跟随以下步骤开始您的 g0v0! 之旅',
    steps: {
      download: {
        title: '下载 osu!lazer',
        description: '从官方网站下载最新版本的 osu!lazer 客户端',
        button: '下载 osu!lazer',
      },
      register: {
        title: '注册账户',
        description: '在 g0v0! 网站上创建您的账户',
        button: '立即注册',
      },
      configure: {
        title: '配置客户端',
        description: '在 osu!lazer 中配置服务器设置',
        serverUrl: '服务器地址',
        instructions: '打开 osu!lazer → 设置 → 在线 → 自定义服务器',
      },
      enjoy: {
        title: '开始游戏',
        description: '登录您的账户并开始享受游戏！',
        button: '查看排行榜',
      },
    },
    support: {
      title: '需要帮助？',
      description: '加入我们的社区获取支持',
      discord: 'Discord 服务器',
      qq: 'QQ 群',
    },
  },
  
  footer: {
    copyright: '© 2025 g0v0.top. 为节奏游戏玩家提供最佳体验',
  },
} as const;
