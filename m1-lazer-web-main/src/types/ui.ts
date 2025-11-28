import type { ComponentType } from 'react';

export interface NavItem {
  path: string;
  title: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
  requireAuth?: boolean;
}
