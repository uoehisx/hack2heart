import gopherImg from './assets/profileImage/gopher.png';
import kodeeImg from './assets/profileImage/kodee.png';
import octocatImg from './assets/profileImage/rustcrab.png';
import rustcrabImg from './assets/profileImage/rustcrab.png';
import scratchcatImg from './assets/profileImage/scratchcat.png';
import tuxImg from './assets/profileImage/tux.png';

export const API_BASE_URL = 'http://api.hack2heart.minsung.kr';
// export const API_BASE_URL = 'http://localhost:8000';

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

export enum GENDER_TYPES {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface Language {
  id: string;
  name: string;
}
export interface Package extends Language {}
export interface Tmi extends Language {}

export enum ReactionType {
  SUPER_LIKE = 'SUPER_LIKE',
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export interface User {
  id: number;
  gender: GENDER_TYPES;
  name: string;
  birth_date: Date;
  avatar_id: number | null;
  most_preferred_language: string | null;
  most_preferred_package: string | null;
  looking_for_love: boolean;
  looking_for_friend: boolean;
  looking_for_coworker: boolean;
  tmis: Tmi[];
  created_at: Date;
}

export const AVATAR_IMG_SRC = [
  gopherImg,
  kodeeImg,
  octocatImg,
  rustcrabImg,
  scratchcatImg,
  tuxImg
  
];

export const DEFAULT_AVATAR_IMG_ID = 4;