export interface CountDownHttpData {
    'duration': number,
    'timeUp': boolean
    'setDuration': number,
    "active": boolean,
    'extensionId': string
}

export interface SuccessData {
    success: boolean
}

export type HoverTarget = string[] | null[]
