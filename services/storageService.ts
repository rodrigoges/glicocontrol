import { Measurement, User } from '../types';

const USER_SESSION_KEY = 'glicoControlUserSession';
const USER_DATA_PREFIX = 'glicoControlData_';

// --- User Session Management ---

export const saveUserSession = (user: User): void => {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
};

export const getUserSession = (): User | null => {
    const userJson = localStorage.getItem(USER_SESSION_KEY);
    if (!userJson) return null;
    try {
        return JSON.parse(userJson) as User;
    } catch (e) {
        console.error("Failed to parse user session", e);
        return null;
    }
};

export const clearUserSession = (): void => {
    localStorage.removeItem(USER_SESSION_KEY);
};


// --- User-specific Measurement Data ---

export const loadMeasurementsForUser = (userId: string): Measurement[] => {
    const dataKey = `${USER_DATA_PREFIX}${userId}`;
    const storedData = localStorage.getItem(dataKey);
    if (storedData) {
        try {
            return JSON.parse(storedData) as Measurement[];
        } catch (e) {
            console.error(`Failed to parse measurements for user ${userId}`, e);
            return [];
        }
    }
    return [];
};

export const saveMeasurementsForUser = (userId: string, measurements: Measurement[]): void => {
    const dataKey = `${USER_DATA_PREFIX}${userId}`;
    localStorage.setItem(dataKey, JSON.stringify(measurements));
};