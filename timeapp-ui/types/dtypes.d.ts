// types/dtypes.d.ts

interface ChromeRuntime {
    runtime?: {
        sendMessage: (
            extensionId: string,
            message: Record<string, unknown>,
            callback?: (response: Record<string, unknown> | undefined) => void
        ) => void;
        lastError?: Error;
    };
}

interface Window {
    chrome?: ChromeRuntime;
    env?: {
        [key: string]: string | undefined;
    };
}
