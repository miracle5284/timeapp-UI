export interface Timer {
    id: string,
    name: string,
    durationSeconds: number,
    remainingDurationSeconds: number,
    status: string,
    isRecurring?: boolean,
    startAt?: string,
    pausedAt?: string,
    resumedAt?: string,
}

export interface TimerResponse {
    count: number,
    next: string | null,
    previous: string | null,
    results: Timer[],
}

export interface SuccessData {
    success: boolean
}

export type HoverTarget = string[] | null[]


export interface IDisplay {
    hours: number[];
    minutes: number[];
    seconds: number[];
}

export interface IStartCountdown {
    id: string | null; name: string; durationSeconds: number; timestamp: string
}

export interface IPauseCountdown {
    id: string,
    remainingDurationSeconds: number,
    timestamp: string
}

export interface IResetCountdown {
    id: string,
}

export interface ICompleteCountdown {
    id: string, timestamp: string
}

export interface CountdownState {
    id: string | null;
    isActive: boolean;
    timeUp: boolean;
    durationSeconds: number;
    remainingDurationSeconds: number;
    startAt: string | null;
    pausedAt: string | null;
    resumedAt: string | null;
    status?: string;
    name?: string;
}

export interface ICountdownResponse {
    id: string;
    name: string;
    pausedAt: string;
    remainingDurationSeconds: number;
    resumedAt: string;
    startAt: string;
    status: "active" | "paused" | "completed" | "inactive";
    updatedAt: string;
}
