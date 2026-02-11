export interface Project {
    id: number;
    title: string;
    description: string;
    tags: string[];
    image: string;
    link?: string;
}

export type AchievementCategory = 'All' | 'Recognition' | 'Certifications' | 'Open Source' | 'Impact';

export interface Achievement {
    id: string;
    title: string;
    issuer: string;
    date: string;
    category: AchievementCategory;
    description: string;
    tech?: string[];
    link?: string;
    verified: boolean;
    image?: string; // Base64 string for uploaded certificate
}

export interface Credentials {
    user: string;
    pass: string;
    masterKey: string;
}

export interface NavProps {
    isDark: boolean;
    toggleTheme: () => void;
}

export interface BackgroundProps {
    isDark: boolean;
}

export interface HeroProps {
    isAdmin: boolean;
    setIsAdmin: (val: boolean) => void;
    credentials: Credentials;
    setCredentials: (creds: Credentials) => void;
    achievements: Achievement[];
    deleteAchievement: (id: string) => void;
}

export interface AchievementsProps {
    isAdmin: boolean;
    achievements: Achievement[];
    addAchievement: (achievement: Achievement) => void;
}