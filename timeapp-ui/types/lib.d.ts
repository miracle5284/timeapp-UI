type EventMap = Record<string, {reason: string}>;
type EventKey = keyof EventMap;
type EventHandler<T extends EventKey> = (payload: EventMap[T]) => void;

/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference lib="webworker" />