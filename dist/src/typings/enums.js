"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgType = exports.PlayerEventsBefore = exports.PlayerEvents = void 0;
var PlayerEvents;
(function (PlayerEvents) {
    PlayerEvents["TrackStart"] = "trackStart";
    PlayerEvents["TrackEnd"] = "trackEnd";
    PlayerEvents["QueueEnd"] = "queueEnd";
})(PlayerEvents || (exports.PlayerEvents = PlayerEvents = {}));
var PlayerEventsBefore;
(function (PlayerEventsBefore) {
    PlayerEventsBefore["trackStart"] = "playerStart";
    PlayerEventsBefore["trackEnd"] = "playerFinish";
    PlayerEventsBefore["queueEnd"] = "queueDelete";
})(PlayerEventsBefore || (exports.PlayerEventsBefore = PlayerEventsBefore = {}));
var ArgType;
(function (ArgType) {
    ArgType[ArgType["String"] = 0] = "String";
    ArgType[ArgType["Void"] = 1] = "Void";
    ArgType[ArgType["Number"] = 2] = "Number";
    ArgType[ArgType["Boolean"] = 3] = "Boolean";
    ArgType[ArgType["Object"] = 4] = "Object";
    ArgType[ArgType["Array"] = 5] = "Array";
})(ArgType || (exports.ArgType = ArgType = {}));
