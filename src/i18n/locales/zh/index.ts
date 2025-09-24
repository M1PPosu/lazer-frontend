import { common } from './common';
import { navigation } from './navigation';
import { pages } from './pages';
import { auth } from './auth';
import { verification } from './verification';
import { privacy } from './privacy';

export const zh = {
  translation: {
    common,
    nav: navigation,
    ...pages,
    auth,
    verification,
    privacy,
  },
} as const;
