export class Mediator {
    constructor() {
        this.connections = new Map();
    }

    init(fn) {
        if (fn && fn instanceof Function) fn.call(null, this);
    }

    on(msg, cb) {
        this.connections.set(msg, cb);
    }

    send(msg, ...a) {
        if (this.connections.has(msg)) this.connections.get(msg).apply(null, a);
    }

    addComponent(component) {
        component.setMediator(this);
    }
}