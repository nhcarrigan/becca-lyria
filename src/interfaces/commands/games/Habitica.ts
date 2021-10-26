import { AxiosRequestHeaders } from "axios";

interface HabiticaUserData {
  auth: {
    local: {
      username: string;
    };
    timestamps: {
      loggedin: string;
      created: string;
      updated: string;
    };
  };
  achievements: {
    streak: number;
    perfect: number;
    quests: {
      [key: string]: number;
    };
  };
  profile: {
    name: string;
    imageURL: string;
  };
  stats: {
    hp: number;
    mp: number;
    exp: number;
    gp: number;
    lvl: number;
    class: string;
    str: number;
    con: number;
    int: number;
    per: number;
    toNextLevel: number;
    maxHealth: number;
    maxMP: number;
  };
}

interface HabiticaAchievementData {
  basic: {
    label: string;
    achievements: {
      [key: string]: HabiticaAchievement;
    };
  };
  onboarding: {
    label: string;
    achievements: {
      [key: string]: HabiticaAchievement;
    };
  };
  seasonal: {
    label: string;
    achievements: {
      [key: string]: HabiticaAchievement;
    };
  };
  special: {
    label: string;
    achievements: {
      [key: string]: HabiticaAchievement;
    };
  };
}

export interface HabiticaUser {
  success: boolean;
  data: HabiticaUserData;
}

export interface HabiticaAchievement {
  title: string;
  text: string;
  icon: string;
  earned: boolean;
  value?: number | boolean;
  index: number;
  optionalCount?: number;
}

export interface HabiticaAchievementResponse {
  success: boolean;
  data: HabiticaAchievementData;
}

export interface HabiticaRequestHeaders extends AxiosRequestHeaders {
  "x-client": string;
  "x-api-user": string;
  "x-api-key": string;
}
