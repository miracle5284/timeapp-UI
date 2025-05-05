const events: { [K in EventKey]?: EventHandler<K>[] } = {};

export const eventBus = {
    on<K extends EventKey>(event: K, callback: EventHandler<K>) {
        (events[event] || (events[event] = [])).push(callback)
    },

    off<K extends EventKey>(event: K, callback: EventHandler<K>) {
        if (events[event]) {
            events[event] = events[event].filter(cb => cb !== callback)
        }
    },

    emit<K extends EventKey>(event: K, payload: EventMap[K]) {
        (events[event] || []).forEach(cb => cb(payload))
    }
};