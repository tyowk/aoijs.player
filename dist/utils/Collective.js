"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collective = void 0;
class Collective extends Map {
    create(key, value) {
        return super.set(key, value);
    }
    filter(fn) {
        return Array.from(this.V).filter(fn);
    }
    filterKeys(fn) {
        return Array.from(this.K).filter(fn);
    }
    find(fn) {
        return Array.from(this.V).find(fn);
    }
    some(fn) {
        return Array.from(this.V).some(fn);
    }
    has(key) {
        return super.has(key);
    }
    get K() {
        return [...this.keys()];
    }
    get V() {
        return [...this.values()];
    }
}
exports.Collective = Collective;
