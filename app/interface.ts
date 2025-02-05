// /app/interface.ts
type Day = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

type FrequencyType = "daily" | "weekly" | `${number}-in-week` | Day[];

interface Habit {
    id?: string;
    name: string;
    currentStreak: number;
    maxStreak: number;
    points: number;
    frequency: FrequencyType;
    done: boolean;
    lastCompletedDate?: string;
    order: number;
}

interface Todo {
    id?: string;
    name: string;
    description: string;
    points: number;
    when_made: Date;
    when_do: Date;
    done: boolean;
    order: number;
}

interface Reward {
    id?: string;
    name: string;
    description: string;
    points: number;
    order: number;
}

interface AppData {
    habits: Record<string, Habit>;
    todo: Record<string, Todo>;
    reward: Record<string, Reward>;
    points: number;
}

export type { Habit, Todo, Reward, AppData, Day, FrequencyType}