"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@walletconnect/utils");
// -- EventManager --------------------------------------------------------- //
var EventManager = /** @class */ (function () {
    function EventManager() {
        this._eventEmitters = [];
    }
    EventManager.prototype.subscribe = function (eventEmitter) {
        this._eventEmitters.push(eventEmitter);
    };
    EventManager.prototype.trigger = function (payload) {
        var eventEmitters = [];
        var event;
        if (utils_1.isJsonRpcRequest(payload)) {
            event = payload.method;
        }
        else if (utils_1.isJsonRpcResponseSuccess(payload) ||
            utils_1.isJsonRpcResponseError(payload)) {
            event = "response:" + payload.id;
        }
        else if (utils_1.isInternalEvent(payload)) {
            event = payload.event;
        }
        else {
            event = '';
        }
        if (event) {
            eventEmitters = this._eventEmitters.filter(function (eventEmitter) { return eventEmitter.event === event; });
        }
        if ((!eventEmitters || !eventEmitters.length) &&
            !utils_1.isReservedEvent(event) &&
            !utils_1.isInternalEvent(event)) {
            eventEmitters = this._eventEmitters.filter(function (eventEmitter) { return eventEmitter.event === 'call_request'; });
        }
        eventEmitters.forEach(function (eventEmitter) {
            if (utils_1.isJsonRpcResponseError(payload)) {
                var error = new Error(payload.error.message);
                eventEmitter.callback(error, null);
            }
            else {
                eventEmitter.callback(null, payload);
            }
        });
    };
    return EventManager;
}());
exports.default = EventManager;
