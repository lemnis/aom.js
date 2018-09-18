class EventTarget {
    constructor() {
        Object.defineProperty(this, "_listeners", { value: new Map() });
    }

    addEventListener(type, listener, options = {}) {
        if (!this._listeners.has(type)) {
            this._listeners.set(type, []);
        }
        this._listeners.get(type).push({listener, options});
    }

    removeEventListener(type, callback, options) {
        if (!this._listeners.has(type)) {
            return;
        }
        var stack = this._listeners.get(type);
        stack.forEach( (listener, i) => {
            if(listener.listener === callback) {
                stack.splice(i, 1);
                return;
            }
        });
    }

    dispatchEvent(event) {
        if (!this._listeners.has(event.type)) {
            return true;
        }
        var stack = this._listeners.get(event.type);

        stack.forEach( listener => {
            listener.call(this, event);
        });
        
        return !event.defaultPrevented;
    }
}

export default EventTarget;