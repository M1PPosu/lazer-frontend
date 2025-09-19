export const pages = {
  // App-level pages
  app: {
    beatmapsComingSoon: 'Beatmaps (coming soon)',
    notFound: '404 - Page not found',
  },
  
  // Home page
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
      discordTag: 'g0v0!',
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
  
  // Rankings page
  rankings: {
    title: 'Rankings',
    tabs: {
      users: 'User Rankings',
      countries: 'Country Rankings',
    },
    rankingTypes: {
      performance: 'Performance',
      score: 'Score',
    },
    gameModes: {
      osu: 'osu!',
      taiko: 'osu!taiko',
      fruits: 'osu!catch',
      mania: 'osu!mania',
    },
    subModes: {
      vanilla: 'Vanilla',
      relax: 'Relax',
      autopilot: 'Autopilot',
    },
    filters: {
      country: 'Country',
      allCountries: 'All Countries',
    },
    userCard: {
      rank: 'Rank',
      performance: 'Performance',
      accuracy: 'Accuracy',
      playCount: 'Play Count',
      country: 'Country',
    },
    countryCard: {
      rank: 'Rank',
      country: 'Country',
      averagePerformance: 'Average Performance',
      totalPerformance: 'Total Performance',
      activeUsers: 'active users',
      playCount: 'plays',
    },
    pagination: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page {{current}} of {{total}}',
    },
    errors: {
      loadFailed: 'Failed to load rankings',
      noData: 'No data available',
    },
  },
  
  // Settings page
  settings: {
    title: 'Account Settings',
    description: 'Manage your account information and preferences',
    errors: {
      loadFailed: 'Unable to load settings',
      tryRefresh: 'Please try refreshing the page'
    },
    username: {
      title: 'Username Settings',
      current: 'Current Username',
      change: 'Change Username',
      placeholder: 'Enter new username',
      hint: 'After changing your username, your old username will be saved in history',
      save: 'Save',
      saving: 'Saving...',
      cancel: 'Cancel',
      success: 'Username changed successfully!',
      errors: {
        empty: 'Username cannot be empty',
        sameAsOld: 'New username is the same as current username',
        taken: 'Username is taken, please choose another one',
        userNotFound: 'User not found',
        failed: 'Failed to change username, please try again later'
      }
    },
    avatar: {
      title: 'Avatar Settings',
      current: 'Current Avatar',
      change: 'Change Avatar',
      hint: 'Supports PNG, JPEG, GIF formats, recommended size 256x256 pixels, max 5MB',
      success: 'Avatar changed successfully!'
    },
    cover: {
      title: 'Cover Settings',
      label: 'Profile Cover Image',
      hint: 'Recommended size: 2000x500 pixels (4:1 ratio recommended), supports PNG, JPEG, GIF formats, max 10MB'
    },
    account: {
      title: 'Account Information',
      userId: 'User ID',
      joinDate: 'Join Date',
      country: 'Country/Region',
      lastVisit: 'Last Visit'
    }
  },
  
  // Teams page
  teams: {
    title: 'Teams',
    tabs: {
      teams: 'Team Rankings',
    },
    createTeam: 'Create Team',
    myTeam: 'My Team',
    joinTeam: 'Join Team',
    viewTeam: 'View Team',
    editTeam: 'Edit Team',
    teamRankings: 'Team Rankings',
    gameModes: {
      osu: 'osu!',
      taiko: 'osu!taiko',
      fruits: 'osu!catch',
      mania: 'osu!mania',
    },
    rankingTypes: {
      performance: 'Performance',
      score: 'Score',
    },
    subModes: {
      vanilla: 'Vanilla',
      relax: 'Relax',
      autopilot: 'Autopilot',
    },
    teamCard: {
      rank: 'Rank',
      members: 'Members',
      captain: 'Captain',
      averageRank: 'Average Rank',
      totalPerformance: 'Total Performance',
      country: 'Country',
    },
    pagination: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page {{current}} of {{total}}',
    },
    errors: {
      loadFailed: 'Failed to load teams',
      noData: 'No team data available',
    },
  },
  
  // Messages page
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
  
  // Profile/User pages
  profile: {
    errors: {
      loadFailed: 'Unable to load profile',
      userNotFound: 'User not found',
      checkId: 'Please check if the user ID or username is correct',
      tryRefresh: 'Please try refreshing the page',
    },
  },
  
  // How to join page
  howToJoin: {
    title: 'How to Join the Server',
    subtitle: 'Follow these steps to start your g0v0! journey',
    steps: {
      download: {
        title: 'Download osu!lazer',
        description: 'Download the latest version of osu!lazer client from the official website',
        button: 'Download osu!lazer',
      },
      register: {
        title: 'Register Account',
        description: 'Create your account on the g0v0! website',
        button: 'Sign up now',
      },
      configure: {
        title: 'Configure Client',
        description: 'Configure server settings in osu!lazer',
        serverUrl: 'Server URL',
        instructions: 'Open osu!lazer → Settings → Online → Custom Server',
      },
      enjoy: {
        title: 'Start Playing',
        description: 'Log in to your account and start enjoying the game!',
        button: 'View Rankings',
      },
    },
    support: {
      title: 'Need Help?',
      description: 'Join our community for support',
      discord: 'Discord Server',
      qq: 'QQ Group',
    },
  },
  
  footer: {
    copyright: '© 2025 g0v0.top. Crafted for rhythm game players.',
  },
} as const;
