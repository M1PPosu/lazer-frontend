export const privacy = {
  dataCollection: {
    title: 'Information We Collect',
    description: 'We collect only the minimum data needed to run the service: account basics (username, email address, and password stored as a salted hash), gameplay and profile data (scores, mods, rankings, clan information, and profile metadata you choose to display), and limited technical logs (IP address, user-agent, timestamps, and anti-abuse/error logs) required to keep the service stable and fair. We do not collect payment information, real names, postal addresses, or other sensitive categories, and the service is not directed to children under 13.',
  },
  microsoftClarity: {
    title: 'Technical Logs, Cookies, and Analytics',
    description: 'We use a minimal amount of technical logging and an essential authentication cookie to keep you signed in, secure the service, and prevent abuse. We do not run marketing trackers, ad networks, or behavioral advertising; any analytics we use are aggregate-only and focused on stability, security, and usability.',
    whatWeCollect: {
      title: 'What technical data do we process?',
      interactions: 'Login events, security and anti-cheat signals, and error or anti-abuse logs needed to enforce server rules and keep leaderboards fair.',
      pageViews: 'Basic page and API requests with timestamps and status codes so we can operate and debug the service in aggregate.',
      clickData: 'High-level navigation and feature usage patterns, considered only in aggregate, to understand which parts of the site are used and to improve usability.',
      scrollBehavior: 'We do not track detailed scroll or mouse heatmap behavior; only limited interaction data necessary for stability and abuse prevention is processed.',
      deviceInfo: 'Standard device and browser information such as IP address and user-agent that is automatically included with your requests and used for security, routing, and anti-abuse.',
    },
    purpose: 'This limited technical data helps us keep accounts working, detect cheating or abuse, maintain fair leaderboards, and improve stability and usability using aggregate analytics only. It is not used for marketing, profiling, or advertising.',
    optOut: {
      title: 'How to control cookies and logging:',
      description: 'You can use browser privacy features (such as clearing cookies, enabling “Do Not Track”, or using privacy extensions) to reduce optional analytics and logging. However, the core authentication cookie is required for login sessions to work, and disabling it will prevent you from staying signed in.',
    },
    //learnMore: 'For more detail about how your data is handled, please review the full Privacy Policy on this page.',
    //privacyStatement: 'M1PPosu Privacy Policy',
  },
  userData: {
    title: 'User Account Data',
    description: 'When you create an account, we store your username, email address, password as a salted hash, and gameplay/profile data such as scores, mods, rankings, clan information, and profile metadata you choose to share. This data is used solely to provide your account, render profiles and leaderboards, and power community features on the private osu! server.',
  },
  dataSecurity: {
    title: 'Data Security',
    description: 'We use strong password hashing, limit who can access administrative tools, and minimize the amount of personal data that we store. While no system is 100% secure, we take reasonable technical and organizational measures to protect your information and will act promptly on credible security reports. Traffic may be routed through or stored on servers operated by reputable providers (for example, via Cloudflare), and we keep collection limited to what is necessary to run the service.',
  },
  yourRights: {
    title: 'Your Rights',
    access: 'Access: You can view and, where available, review your account and profile information directly in the service.',
    correction: 'Correction: You can update certain profile details yourself and may contact us if something appears inaccurate or needs correction.',
    deletion: 'Deletion: You can request permanent deletion of your account and associated personal data by emailing contact@m1pposu.dev and including your username and registered email for verification.',
    portability: 'Portability: Where technically feasible, you may request a copy of your data in a portable format so long as it does not compromise the privacy or security of others.',
  },
  contact: {
    title: 'Contact',
    description: 'For questions or requests about this Privacy Policy or how your data is handled, you can contact the M1PP Team at contact@m1pposu.dev or via the support channels on our discord!',
  },
  updates: {
    title: 'Policy Updates',
    description: 'We may update this Privacy Policy if the project or legal requirements change. Material changes will be announced on the website or in our community channels (such as Discord), and continued use of the service after changes take effect means you accept the updated policy.',
  },
  lastUpdated: 'Last updated',
} as const;
