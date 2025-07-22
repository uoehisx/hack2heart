// export const API_BASE_URL = 'http://api.hack2heart.minsung.kr';
export const API_BASE_URL = 'http://localhost:8000';

export enum PANEL_TYPES {
  EXPLORE = 'hack2heart.panel-explore',
  UPLOAD = 'hack2heart.panel-upload',
  MYCODE = 'hack2heart.panel-mycode',
  TEST = 'hack2heart.panel-test',
}

export const DEFAULT_PANEL_TITLES: Record<PANEL_TYPES, string> = {
  [PANEL_TYPES.EXPLORE]: 'Explore Panel',
  [PANEL_TYPES.UPLOAD]: 'Upload Panel',
  [PANEL_TYPES.MYCODE]: 'My Code Panel',
  [PANEL_TYPES.TEST]: 'Test Panel',
};

export enum SIDEBAR_TYPES {
  WELCOME = 'hack2heart.sidebar-welcome',
  PROFILE = 'hack2heart.sidebar-profile',
  HOME = 'hack2heart.sidebar-home',
  CHAT = 'hack2heart.sidebar-chat',
}

export const DEFAULT_SIDEBAR_TITLES: Record<SIDEBAR_TYPES, string> = {
  [SIDEBAR_TYPES.WELCOME]: 'Welcome Sidebar',
  [SIDEBAR_TYPES.PROFILE]: 'Profile Sidebar',
  [SIDEBAR_TYPES.HOME]: 'Home Sidebar',
  [SIDEBAR_TYPES.CHAT]: 'Chat Sidebar',
};
