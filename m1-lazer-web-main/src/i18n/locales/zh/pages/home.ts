export const homePage = {
  hero: {
    tagline: '你打造的 lazer 服务器',
    description:
      'M1Lazer! 是一个全新的 osu! 私人服务器，<bold>专为 lazer 客户端打造</bold>，<bold>由 g0v0! 开发</bold>。我们支持 standard / taiko / catch / mania 四大模式，提供 RX/AP pp 计算与无限制改名，让你可以按照自己的方式畅玩游戏。',
    statusOperational: '所有服务运行正常',
    statusCommunity: '加入我们的 Discord 社区获取支持和最新消息',
    joinCta: '立即加入',
    viewProfile: '查看资料',
    viewRankings: '查看排行榜',
    register: '注册',
    login: '登录',
    featuresTitle: '功能特色',
    featuresSubtitle: '探索我们为您提供的丰富功能和特色服务',
    community: {
      qq: '启动器',
      discord: 'Discord',
      github: 'GitHub',
      discordTag: 'M1PPosu',
    },
  },

  features: {
    items: [
      {
        title: '全平台支持',
        content:
          'M1Lazer! 专为 lazer 客户端打造，这意味着只要您的系统支持 osu! lazer，就可以畅玩 M1Lazer!，完全不会受到平台限制。',
        imageAlt: '全平台支持',
      },
      {
        title: '谱面加速下载',
        content:
          '我们使用 Sayobot 谱面镜像服务，为中国玩家提供高速下载体验，让下载谱面不再是一场漫长的等待。',
        imageAlt: '谱面加速下载',
      },
      {
        title: '活跃的社区支持',
        content:
          '我们的官方 Discord 服务器是大家求助、分享高光时刻、休闲聊天的理想社区，一起交流节奏游戏的乐趣！',
        imageAlt: '活跃的社区支持',
      },
      {
        title: '极致个性化',
        content:
          '你可以自由修改用户名、上传自定义横幅，并打造炫酷的个人资料和签名，让你的创意在这里尽情绽放。',
        imageAlt: '极致个性化',
      },
      {
        title: '对开发者友好',
        content:
          '我们的服务器完全遵循官方 osu! v1/v2 API 规范设计，让你可以更加方便、快速地将 bot 和各类服务接入 M1Lazer!。',
        imageAlt: '对开发者友好',
      },
      {
        title: '开源与透明',
        content:
          '服务器与客户端均为开源项目。服务端还提供 Hooks 支持，可通过插件扩展更多功能（开发中）。',
        imageAlt: '开源与透明',
      },
      {
        title: '用户谱面投稿',
        content:
          '你可以提交自制谱面，或从官服导入无法计算 pp 的未上榜谱面，并在这里通过审核（开发中）。',
        imageAlt: '用户谱面投稿',
      },
      {
        title: 'Ruleset 排行榜',
        content:
          '我们支持自定义 ruleset 的分数计算与成绩上传，并提供完善的排行榜系统（开发中）。',
        imageAlt: 'Ruleset 排行榜',
      },
    ],
  },
} as const;
