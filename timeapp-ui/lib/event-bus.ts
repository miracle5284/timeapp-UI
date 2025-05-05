type EventHandler = (payload?: object) => void;

const events: Record<string, EventHandler[]> = {};

export const eventBus = {
    on(event: string, callback: EventHandler) {
        (events[event] || (events[event] = [])).push(callback)
    },

    off(event: string, callback: EventHandler) {
        if (events[event]) {
            events[event] = events[event].filter(cb => cb !== callback)
        }
    },

    emit(event: string, payload?: object) {
        (events[event] || []).forEach(cb => cb(payload))
    }
};