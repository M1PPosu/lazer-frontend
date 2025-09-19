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
    title: 'Team Rankings',
    description: 'View the performance and ranking of teams',
    tabs: {
      teams: 'Team Rankings',
    },
    createTeam: 'Create Team',
    myTeam: 'My Team',
    joinTeam: 'Join Team',
    viewTeam: 'View Team',
    editTeam: 'Edit Team',
    teamRankings: 'Team Rankings',
    loadingTeams: 'Loading team rankings data...',
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
    rankingType: {
      label: 'Ranking Type',
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
    detail: {
      createdAt: 'Created on {{date}}',
      members: '{{count}} members',
      captain: 'Captain',
      membersSectionTitle: 'Members',
      teamMembers: 'Team Members',
      memberCount: '({{count}} people)',
      loading: 'Loading team details...',
      notFound: 'Team not found',
      notFoundDescription: 'The team information was not found',
      backToTeams: 'Back to teams',
      teamInfo: 'Team header information',
      coverImage: 'Cover image',
      teamFlag: 'Team flag',
      teamBasicInfo: 'Team basic information',
      teamActions: 'Team action buttons',
      captainInfo: 'Captain information',
      memberActions: 'Member action buttons',
      joinTeam: 'Request to Join',
      joining: 'Requesting...',
      leaveTeam: 'Leave Team',
      leaving: 'Leaving...',
      editTeam: 'Edit Team',
      deleteTeam: 'Delete Team',
      kickMember: 'Kick',
      kicking: 'Kicking...',
      joinRequestSent: 'Join request sent, please wait for captain approval',
      leftTeam: 'Left the team',
      confirmLeave: 'Are you sure you want to leave this team?',
      confirmDelete: 'Are you sure you want to delete this team? This action cannot be undone!',
      confirmKick: 'Are you sure you want to kick {{username}}?',
      teamDeleted: 'Team deleted',
      memberKicked: '{{username}} has been kicked from the team',
    },
    create: {
      loginRequired: 'You need to login to create or edit teams',
      nameRequired: 'Please enter team name',
      shortNameRequired: 'Please enter team short name',
      assetsRequired: 'Please upload team flag and cover',
      updateSuccess: 'Team information updated successfully',
      createSuccess: 'Team created successfully',
      loading: 'Loading team information...',
      editTeam: 'Edit Team',
      createTeam: 'Create Team',
      editDescription: 'Modify your team information',
      createDescription: 'Create a new team and invite friends to play together',
      basicInfo: 'Basic Information',
      teamName: 'Team Name',
      teamNamePlaceholder: 'Enter team name',
      teamShortName: 'Team Short Name',
      teamShortNamePlaceholder: 'Enter team short name',
      shortNameDescription: 'Short name will be displayed in rankings, recommend using 2-5 characters',
      teamFlag: 'Team Flag',
      selectFlag: 'Select flag',
      flagDescription: 'Standard size: 240×120px, max 2MB, supports cropping',
      teamCover: 'Team Cover',
      selectCover: 'Select cover',
      coverDescription: 'Recommended size: 1920×1280px, max 10MB, supports cropping',
      creatingTeam: 'Creating team...',
      memberManagement: 'Member Management',
      leaderTransfer: 'Transfer Leadership (Optional)',
      keepCurrentLeader: 'Keep current leader',
      leaderTransferDescription: 'Select a new leader. If not selected, current leader will remain. After transferring leadership, you will lose management permissions.',
      currentMembers: 'Current members ({{count}} people)',
      currentLeader: 'Current leader',
      willBecomeLeader: 'Will become new leader',
      noMembersAvailable: 'No members available for selection',
      unknown: 'Unknown',
      cancel: 'Cancel',
      saving: 'Saving...',
      saveChanges: 'Save Changes',
      required: '*',
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
    subtitle: 'There are two ways to connect to our server',
    copyFailed: 'Copy failed:',
    clickToCopy: 'Click to copy',
    
    method1: {
      title: 'Use our Custom Client',
      recommended: 'Recommended',
      description: 'This method is recommended for all users who can run osu!lazer on their platform.',
      steps: {
        title: 'Steps:',
        step1: {
          title: 'Download g0v0! Custom Client',
          pcVersion: 'PC Version:',
          androidVersion: 'Android Version:',
          downloadPc: 'Download PC g0v0! Client',
          downloadAndroidDomestic: 'Domestic Download',
          downloadAndroidOverseas: 'Overseas Download',
        },
        step2: {
          title: 'Launch the game, open Settings → Online, and enter in the "Custom API Server URL" field:',
          clickToView: 'Click image to view larger:',
          settingExample: 'Settings example',
        },
        step3: {
          title: 'Restart the game and start enjoying!',
        },
      },
    },
    
    method2: {
      title: 'Use Authlib Injector (for x86_64 platforms)',
      suitableFor: 'This method is suitable for the following users:',
      platforms: [
        'Windows (x64 or x86 platform)',
        'Linux (x64 or x86 platform)',
        'Non-Apple Silicon Mac (such as MacBooks from before 2020)',
      ],
      steps: {
        title: 'Steps:',
        step1: {
          title: 'Download LazerAuthlibInjection',
          button: 'Download LazerAuthlibInjection',
        },
        step2: {
          title: 'Install it as a ruleset in osu!lazer',
          description: 'Install the downloaded LazerAuthlibInjection as a ruleset in osu!lazer',
        },
        step3: {
          title: 'Launch the game, go to Settings → Rulesets, then fill in the following information:',
          description: 'Configure server connection information in game settings',
          apiUrl: 'API URL:',
          websiteUrl: 'Website URL:',
        },
        step4: {
          title: 'After seeing the "API settings changed" notification, restart the client and start enjoying the game!',
          description: 'Restart the client after completing the setup to connect to the server',
        },
      },
      warning: {
        title: 'Important Notice',
        description: 'If you use this method\'s installation patch, please do not log in and play on the official server. Otherwise, your account may be banned. Please use with caution.',
      },
    },
  },
  
  footer: {
    copyright: '© 2025 g0v0.top. Crafted for rhythm game players.',
  },
} as const;
