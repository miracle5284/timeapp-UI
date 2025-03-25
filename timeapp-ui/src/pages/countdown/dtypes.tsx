export interface CountDownHttpData {
    'duration': number,
    'timeUp': boolean
    'initialDuration': number,
    "active": boolean,
    'extensionId': string
}

export interface SuccessData {
    success: boolean
}

export const BACKEND_URL = 'https://localhost/'