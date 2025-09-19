export const resources = {
  zh: {
    translation: {
      common: {
        brandName: '咕哦！',
        brandAlt: '咕哦！Logo',
        language: {
          label: '语言',
          switch: '切换至 {{language}}',
          zh: '中文',
          en: 'English',
        },
        authAgreement: '登录即表示你同意我们的服务条款和隐私政策',
        registerAgreement: '注册即表示你同意我们的服务条款和隐私政策',
      },
      nav: {
        home: '主页',
        rankings: '排行榜',
        beatmaps: '谱面',
        teams: '战队',
        messages: '消息',
        profile: '个人资料',
        join: '加入服务器',
        settings: '设置',
        login: '登录',
        register: '注册',
      },
      app: {
        beatmapsComingSoon: '谱面（即将推出）',
        notFound: '404 - 页面未找到',
      },
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
      footer: {
        copyright: '© 2025 g0v0.top. 为节奏游戏玩家提供最佳体验',
      },
      auth: {
        login: {
          title: '登录',
          subtitle: '登录到你的 咕哦！ 账户',
          username: '用户名',
          password: '密码',
          usernamePlaceholder: '输入用户名',
          passwordPlaceholder: '输入密码',
          submit: '登录',
          noAccount: '还没有账户？',
          registerNow: '立即注册',
        },
        register: {
          title: '注册',
          subtitle: '创建你的 咕哦！ 账户',
          username: '用户名',
          email: '邮箱',
          password: '密码',
          confirmPassword: '确认密码',
          usernamePlaceholder: '输入用户名',
          emailPlaceholder: '输入邮箱地址',
          passwordPlaceholder: '输入密码',
          confirmPasswordPlaceholder: '确认密码',
          submit: '注册',
          hasAccount: '已有账户？',
          loginNow: '立即登录',
          errors: {
            usernameRequired: '用户名为必填项',
            usernameMin: '用户名至少需要3个字符',
            usernameMax: '用户名最多15个字符',
            usernamePattern: '用户名只能包含字母、数字、下划线和连字符',
            usernameStart: '用户名不能以数字开头',
            emailRequired: '邮箱为必填项',
            emailInvalid: '请输入有效的邮箱地址',
            passwordRequired: '密码为必填项',
            passwordMin: '密码至少需要8个字符',
            passwordStrength: '密码必须包含大小写字母和数字',
            confirmPasswordRequired: '请确认密码',
            confirmPasswordMatch: '两次输入的密码不一致',
          },
        },
      },
    },
  },
  en: {
    translation: {
      common: {
        brandName: 'GuSou!',
        brandAlt: 'GuSou! logo',
        language: {
          label: 'Language',
          switch: 'Switch to {{language}}',
          zh: 'Chinese',
          en: 'English',
        },
        authAgreement: 'By signing in you agree to our Terms of Service and Privacy Policy',
        registerAgreement: 'By creating an account you agree to our Terms of Service and Privacy Policy',
      },
      nav: {
        home: 'Home',
        rankings: 'Rankings',
        beatmaps: 'Beatmaps',
        teams: 'Teams',
        messages: 'Messages',
        profile: 'Profile',
        join: 'Join Server',
        settings: 'Settings',
        login: 'Sign in',
        register: 'Sign up',
      },
      app: {
        beatmapsComingSoon: 'Beatmaps (coming soon)',
        notFound: '404 - Page not found',
      },
      hero: {
        tagline: 'Probably the best osu! private server',
        description:
          'g0v0! is a brand-new osu! private server <bold>built for the lazer client</bold>. We support the standard / taiko / catch / mania rulesets, RX/AP pp calculation, and unlimited renames so you can play your way.',
        statusOperational: 'All services are operational',
        statusCommunity: 'Join our QQ / Discord community for support and updates',
        joinCta: 'How to join the server',
        viewProfile: 'View profile',
        viewRankings: 'View rankings',
        register: 'Sign up',
        login: 'Sign in',
        featuresTitle: 'Feature highlights',
        featuresSubtitle: 'Discover the rich features and services we provide for you',
        community: {
          qq: 'QQ Group',
          discord: 'Discord',
          github: 'GitHub',
          discordTag: 'GuSou!',
        },
      },
      features: {
        items: [
          {
            title: 'Works on every platform',
            content:
              'g0v0! is designed for lazer, which means you can play on any system that supports osu! lazer without platform limitations.',
            imageAlt: 'Works on every platform',
          },
          {
            title: 'Faster beatmap downloads',
            content:
              'We use Sayobot mirror services to deliver speedy downloads for players in China, so grabbing maps is no longer a waiting game.',
            imageAlt: 'Faster beatmap downloads',
          },
          {
            title: 'Active community support',
            content:
              'Our official QQ group and Discord server provide the perfect place to ask for help, share highlights, or just hang out.',
            imageAlt: 'Active community support',
          },
          {
            title: 'Ultimate customization',
            content:
              'Freely change your username, upload custom banners, and create a dazzling profile and signature—let your creativity run wild.',
            imageAlt: 'Ultimate customization',
          },
          {
            title: 'Developer friendly',
            content:
              'Our server follows the official osu! v1/v2 API specs so you can integrate bots and services into g0v0! faster and easier.',
            imageAlt: 'Developer friendly',
          },
          {
            title: 'Open and transparent',
            content:
              'Both the server and client are open source. The server also provides hook support so you can extend it with plugins (in development).',
            imageAlt: 'Open and transparent',
          },
          {
            title: 'User-submitted beatmaps',
            content:
              'Submit your own beatmaps or ranked-ineligible maps from the official server and get them approved here (in development).',
            imageAlt: 'User-submitted beatmaps',
          },
          {
            title: 'Ruleset leaderboards',
            content:
              'We support custom ruleset score calculations and submissions, plus robust leaderboard support (in development).',
            imageAlt: 'Ruleset leaderboards',
          },
        ],
      },
      footer: {
        copyright: '© 2025 g0v0.top. Crafted for rhythm game players.',
      },
      auth: {
        login: {
          title: 'Sign in',
          subtitle: 'Sign in to your GuSou! account',
          username: 'Username',
          password: 'Password',
          usernamePlaceholder: 'Enter username',
          passwordPlaceholder: 'Enter password',
          submit: 'Sign in',
          noAccount: "Don't have an account?",
          registerNow: 'Create one',
        },
        register: {
          title: 'Sign up',
          subtitle: 'Create your GuSou! account',
          username: 'Username',
          email: 'Email',
          password: 'Password',
          confirmPassword: 'Confirm password',
          usernamePlaceholder: 'Enter username',
          emailPlaceholder: 'Enter email address',
          passwordPlaceholder: 'Enter password',
          confirmPasswordPlaceholder: 'Confirm password',
          submit: 'Sign up',
          hasAccount: 'Already have an account?',
          loginNow: 'Sign in instead',
          errors: {
            usernameRequired: 'Username is required',
            usernameMin: 'Username must be at least 3 characters',
            usernameMax: 'Username must be at most 15 characters',
            usernamePattern: 'Username may contain letters, numbers, underscores, and hyphens only',
            usernameStart: 'Username cannot start with a number',
            emailRequired: 'Email is required',
            emailInvalid: 'Please enter a valid email address',
            passwordRequired: 'Password is required',
            passwordMin: 'Password must be at least 8 characters',
            passwordStrength: 'Password must include uppercase letters, lowercase letters, and numbers',
            confirmPasswordRequired: 'Please confirm your password',
            confirmPasswordMatch: 'The passwords do not match',
          },
        },
      },
    },
  },
} as const;

export type AppLanguages = keyof typeof resources;
