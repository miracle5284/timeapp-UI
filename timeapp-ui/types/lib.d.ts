type EventMap = Record<string, {reason: string}>;
type EventKey = keyof EventMap;
type EventHandler<T extends EventKey> = (payload: EventMap[T]) => void;