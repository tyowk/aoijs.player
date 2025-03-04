"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Events_instances, _Events_bindEvents;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Events = void 0;
class Events {
    constructor(manager) {
        _Events_instances.add(this);
        this.manager = manager;
        __classPrivateFieldGet(this, _Events_instances, "m", _Events_bindEvents).call(this, this.manager.player.events);
    }
}
exports.Events = Events;
_Events_instances = new WeakSet(), _Events_bindEvents = function _Events_bindEvents(ctx) {
    ctx.on('playerStart', (...args) => ctx.emit('trackStart', ...args));
    ctx.on('playerFinish', (...args) => ctx.emit('trackEnd', ...args));
    ctx.on('queueDelete', (...args) => ctx.emit('queueEnd', ...args));
};
