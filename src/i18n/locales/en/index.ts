import { common } from './common';
import { navigation } from './navigation';
import { pages } from './pages';
import { auth } from './auth';

export const en = {
  translation: {
    common,
    nav: navigation,
    ...pages,
    auth,
  },
} as const;
