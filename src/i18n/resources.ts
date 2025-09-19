import { zh } from './locales/zh';
import { en } from './locales/en';

export const resources = {
  zh,
  en,
} as const;

export type AppLanguages = keyof typeof resources;
