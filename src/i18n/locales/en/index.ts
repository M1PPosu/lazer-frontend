import { common } from './common';
import { navigation } from './navigation';
import { pages } from './pages';
import { auth } from './auth';
import { verification } from './verification';

export const en = {
  translation: {
    common,
    nav: navigation,
    ...pages,
    auth,
    verification,
  },
} as const;
