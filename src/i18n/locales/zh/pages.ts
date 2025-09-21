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
    title: '战队排行榜',
    description: '查看各个战队的表现和实力排名',
    tabs: {
      teams: '战队排行',
    },
    createTeam: '创建战队',
    myTeam: '我的战队',
    joinTeam: '加入战队',
    viewTeam: '查看战队',
    editTeam: '编辑战队',
    teamRankings: '战队排行榜',
    loadingTeams: '加载战队排行榜数据中...',
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
    rankingType: {
      label: '排行类型',
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
    detail: {
      createdAt: '创建于 {{date}}',
      members: '{{count}} 名成员',
      captain: '队长',
      membersSectionTitle: '成员',
      teamMembers: '团队成员',
      memberCount: '({{count}} 人)',
      loading: '加载战队详情中...',
      notFound: '战队不存在',
      notFoundDescription: '未找到该战队信息',
      backToTeams: '返回战队列表',
      teamInfo: '战队头部信息',
      coverImage: '封面图片',
      teamFlag: '战队旗帜',
      teamBasicInfo: '战队基本信息',
      teamActions: '战队操作按钮',
      captainInfo: '队长信息',
      memberActions: '成员操作按钮',
      joinTeam: '请求加入',
      joining: '请求中...',
      leaveTeam: '退出战队',
      leaving: '退出中...',
      editTeam: '编辑战队',
      deleteTeam: '删除战队',
      kickMember: '踢出',
      kicking: '踢出中...',
      joinRequestSent: '加入请求已发送，请等待队长审核',
      leftTeam: '已退出战队',
      confirmLeave: '确定要退出这个战队吗？',
      confirmDelete: '确定要删除这个战队吗？此操作不可撤销！',
      confirmKick: '确定要踢出 {{username}} 吗？',
      teamDeleted: '战队已删除',
      memberKicked: '已将 {{username}} 踢出战队',
    },
    create: {
      loginRequired: '您需要登录后才能创建或编辑战队',
      nameRequired: '请输入战队名称',
      shortNameRequired: '请输入战队简称',
      assetsRequired: '请上传战队旗帜和封面',
      updateSuccess: '战队信息更新成功',
      createSuccess: '战队创建成功',
      loading: '加载战队信息中...',
      editTeam: '编辑战队',
      createTeam: '创建战队',
      editDescription: '修改您的战队信息',
      createDescription: '创建一个新的战队，邀请朋友一起游戏',
      basicInfo: '基本信息',
      teamName: '战队名称',
      teamNamePlaceholder: '输入战队名称',
      teamShortName: '战队简称',
      teamShortNamePlaceholder: '输入战队简称',
      shortNameDescription: '简称将显示在排行榜中，建议使用 2-5 个字符',
      teamFlag: '战队旗帜',
      selectFlag: '选择旗帜',
      flagDescription: '标准尺寸: 240×120px，最大 2MB，支持裁剪调整',
      teamCover: '战队封面',
      selectCover: '选择封面',
      coverDescription: '推荐尺寸: 1920×1280px，最大 10MB，支持裁剪调整',
      creatingTeam: '创建战队中...',
      memberManagement: '队员管理',
      leaderTransfer: '队长转让 (可选)',
      keepCurrentLeader: '保持当前队长',
      leaderTransferDescription: '选择一个新的队长，如果不选择则保持当前队长不变。转让队长权限后，您将失去管理权限。',
      currentMembers: '当前队员 ({{count}} 人)',
      currentLeader: '当前队长',
      willBecomeLeader: '将成为新队长',
      noMembersAvailable: '没有可选择的成员',
      unknown: '未知',
      cancel: '取消',
      saving: '保存中...',
      saveChanges: '保存修改',
      required: '*',
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
    info: {
      title: '玩家信息',
      globalRank: '全球排名',
      countryRank: '地区排名',
      underConstruction: '剩下数据正在努力施工中',
    },
    stats: {
      rankedScore: '计分成绩总分',
      accuracy: '准确率',
      playCount: '游戏次数',
      totalScore: '总分',
      totalHits: '总命中次数',
      hitsPerPlay: '每次游玩击打数',
      maxCombo: '最大连击',
      replaysWatched: '回放被观看次数',
      medals: '奖章',
      pp: 'PP',
      playTime: '游玩时间',
    },
    activities: {
      title: '最近活动',
      noActivities: '暂无最近活动',
      loadFailed: '加载用户活动失败',
      loadMore: '加载更多',
      loading: '加载中...',
      timeAgo: {
        justNow: '刚刚',
        minutesAgo: '{{count}}分钟前',
        hoursAgo: '{{count}}小时前',
        daysAgo: '{{count}}天前',
        monthsAgo: '{{count}}个月前',
        yearsAgo: '{{count}}年前',
      },
      types: {
        rank: {
          prefix: '在',
          middle: '中获得了',
          grade: '评级',
          rankPrefix: '排名第',
        },
        rankLost: {
          prefix: '在',
          suffix: '中失去了第一名',
        },
        achievement: '获得了成就',
        beatmapUpload: '上传了谱面',
        beatmapUpdate: '更新了谱面',
        beatmapRanked: '谱面被ranked',
        beatmapLoved: '谱面获得Loved',
        beatmapRevived: '谱面被复活',
        beatmapDeleted: '谱面被删除',
        usernameChange: '更改了用户名',
        supportAgain: '再次成为了Supporter',
        supportFirst: '首次成为了Supporter',
        supportGift: '获得了Supporter赠送',
        activity: '进行了活动',
      },
    },
    bestScores: {
      title: '最佳成绩',
      noScores: '暂无最佳成绩',
      loadFailed: '加载最佳成绩失败',
      loadMore: '加载更多',
      loading: '加载中...',
      by: 'by',
    },
    friends: {
      loading: '加载中...',
    },
    userPage: {
      title: '个人介绍',
      noContent: '还没有写个人介绍',
      writeButton: '编写个人介绍',
      editButton: '编辑',
      editTitle: '编辑个人介绍',
      placeholder: '使用 BBCode 编写你的个人介绍...',
      editorPlaceholder: '为 {{username}} 编写个人介绍...\n\n你可以使用BBCode格式化文本，比如：\n[b]粗体文本[/b]\n[i]斜体文本[/i]\n[color=red]彩色文本[/color]\n\n点击工具栏按钮或使用快捷键来快速插入格式。',
      processing: '内容正在处理中...',
      cancel: '取消',
      save: '保存',
      saving: '保存中...',
      saveSuccess: '个人页面已保存成功！',
      saveError: '保存失败，请重试',
      hasUnsavedChanges: '有未保存的更改',
      confirmDiscard: '您有未保存的更改，确定要放弃编辑吗？',
      noEditPermission: '您没有权限编辑此用户的页面',
      cannotEditPage: '无法编辑此页面',
      loadingEditor: '加载编辑器中...',
      editPageTitle: '编辑个人页面',
      editPageSubtitle: '为 {{username}} 编辑个人介绍',
      unsavedChanges: '有未保存的更改',
      cancelEditTooltip: '取消编辑 (Esc)',
      saveShortcut: 'Ctrl+S 保存',
      supportsBBCode: '支持BBCode格式',
      bbcodeDescription: 'BBCode 是一种轻量级标记语言，用于格式化文本。您可以使用以下标签来美化您的个人介绍：',
      usePreview: '使用预览功能查看最终效果',
      editCover: '编辑封面',
    },
    friendActions: {
      selfProfile: '自己的资料',
      blocked: '已屏蔽该用户',
      mutualFollow: '互相关注 - 你们相互关注',
      following: '已关注 - 你关注了此用户',
      followsYou: '关注你的用户 - 对方关注了你',
      notFollowing: '未关注 - 点击查看关注选项',
      unblock: '取消屏蔽',
      cancelMutualFollow: '取消互相关注',
      unfollow: '取消关注',
      block: '屏蔽',
      followBack: '回关 (互相关注)',
      follow: '关注',
    },
    bbcodeEditor: {
      placeholder: '在这里输入BBCode内容...',
      toolbar: {
        bold: '粗体',
        italic: '斜体',
        underline: '下划线',
        strikethrough: '删除线',
        spoiler: '剧透',
        color: '颜色',
        fontSize: '字体大小',
        image: '插入图片',
        link: '插入链接',
        userProfile: '用户主页链接',
        email: '邮箱链接',
        youtube: 'YouTube视频',
        audio: '音频',
        imagemap: '图片映射',
        quote: '引用',
        code: '代码块',
        list: '列表',
        box: '折叠框',
        center: '居中对齐',
        heading: '标题',
        notice: '通知框',
        help: '帮助',
      },
      insertText: {
        bold: '粗体文本',
        italic: '斜体文本',
        underline: '下划线文本',
        strikethrough: '删除线文本',
        colorText: '彩色文本',
        text: '文本',
        linkText: '链接文本',
        username: '用户名',
        emailLink: '邮箱链接',
        clickToVisit: '点击访问网站',
        infoArea: '这是信息区域',
        quoteContent: '引用内容',
        codeContent: '代码内容',
        item1: '项目1',
        item2: '项目2',
        title: '标题',
        collapsibleContent: '折叠内容',
        spoilerContent: '剧透内容',
        centerText: '居中文本',
        headingText: '标题文本',
        importantNotice: '重要通知',
      },
      colors: {
        text: '色文本',
      },
      fontSize: {
        label: '字体大小',
        extraSmall: '极小',
        small: '小',
        normal: '普通',
        large: '大',
      },
      help: {
        title: 'BBCode帮助',
        button: '帮助',
        examples: {
          bold: '粗体',
          italic: '斜体',
          underline: '下划线',
          strikethrough: '删除线',
          color: '彩色',
          size: '大小',
          link: '链接',
          text: '文本',
          imageUrl: '图片URL',
          quote: '引用',
          code: '代码',
          item1: '项目1',
          item2: '项目2',
        },
      },
      modes: {
        edit: '编辑',
        preview: '预览',
      },
      preview: {
        noContent: '输入内容以查看预览',
        generateFailed: '无法生成预览',
        generating: '生成预览中...',
      },
      validation: {
        networkError: '验证失败，请检查网络连接',
        validating: '验证中',
        syntaxCorrect: '语法正确',
        errors: '个错误',
        syntaxErrors: 'BBCode语法错误',
      },
    },
  },
  
  
  "howToJoin": {
    "title": "如何加入服务器",
    "subtitle": "有两种方式连接到我们的服务器",
    "copyFailed": "复制失败:",
    "clickToCopy": "点击复制",
    "method1": {
      "title": "使用我们的自定义客户端",
      "recommended": "推荐",
      "description": "此方法推荐给所有能在其平台上运行 osu!lazer 的用户。",
      "steps": {
        "title": "操作步骤：",
        "step1": {
          "title": "下载 g0v0! 自定义客户端",
          "pcVersion": "PC 版本：",
          "androidVersion": "安卓版本：",
          "downloadPc": "从 GitHub Releases 下载",
          "downloadAndroidDomestic": "国内网盘下载",
          "downloadAndroidOverseas": "国外网盘下载"
        },
        "step2": {
          "title": "启动游戏，打开 设置 → 在线，在\"Custom API Server URL\"字段中填入：",
          "description": "在osu lazer的设置中找到“在线”Section，找到“Custom API Server URL”设置项，并在其输入框中输入下面的文本：",
          "imageHint": "如图所示"
        },
        "step3": {
          "title": "重启游戏，开始享受游戏！",
          "description": "输入URL后退出osu lazer并重新启动即可生效"
        }
      }
    },
    "method2": {
      "title": "使用 Authlib Injector（适用于 x86_64 平台）",
      "suitableFor": "此方法适用于以下用户：",
      "platforms": {
        "windows": "Windows 用户（WOA 暂不支持）",
        "linux": "任意 Linux 发行版（arm64 及其他 arm 设备不支持）",
        "mac": "macOS（Apple Silicon 不支持）"
      },
      "steps": {
        "title": "操作步骤：",
        "step1": {
          "title": "下载 LazerAuthlibInjection",
          "download": "从 GitHub Releases 下载",
          "button": "下载 LazerAuthlibInjection"
        },
        "step2": {
          "title": "将其作为规则集安装到 osu!lazer 中",
          "description": "将下载的 LazerAuthlibInjection 作为规则集安装到 osu!lazer 中"
        },
        "step3": {
          "title": "启动游戏，进入 设置 → 游戏模式，然后填入以下信息：",
          "description": "在游戏设置中配置服务器连接信息",
          "apiUrl": "API URL：",
          "websiteUrl": "Website URL："
        },
        "step4": {
          "title": "出现\"API 设置已更改\"通知后，重启客户端，开始享受游戏！",
          "description": "完成设置后重启客户端即可连接到服务器"
        }
      },
      "warning": {
        "title": "重要提示",
        "description": "虽然 ppy 明确声明不对 ruleset 进行反作弊检测，但我们建议您尽量不要将安装 AuthLibInject 后的 osu!lazer 客户端连接到官方服务器，可能会导致账号被封禁！"
      }
    }
  },
  
  footer: {
    copyright: '© 2025 g0v0.top. 为节奏游戏玩家提供最佳体验',
  },
} as const;
