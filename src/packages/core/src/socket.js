"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// -- SocketTransport ------------------------------------------------------ //
var SocketTransport = /** @class */ (function () {
    // -- constructor ----------------------------------------------------- //
    function SocketTransport(opts) {
        this._events = [];
        this._initiating = false;
        this._bridge = '';
        this._socket = null;
        this._queue = [];
        if (!opts.bridge || typeof opts.bridge !== 'string') {
            throw new Error('Missing or invalid bridge field');
        }
        this._bridge = opts.bridge;
        if (!opts.clientId || typeof opts.clientId !== 'string') {
            throw new Error('Missing or invalid clientId field');
        }
        this._clientId = opts.clientId;
    }
    Object.defineProperty(SocketTransport.prototype, "readyState", {
        get: function () {
            return this._socket ? this._socket.readyState : -1;
        },
        set: function (value) {
            // empty
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SocketTransport.prototype, "connecting", {
        get: function () {
            return this.readyState === 0;
        },
        set: function (value) {
            // empty
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SocketTransport.prototype, "connected", {
        get: function () {
            return this.readyState === 1;
        },
        set: function (value) {
            // empty
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SocketTransport.prototype, "closing", {
        get: function () {
            return this.readyState === 2;
        },
        set: function (value) {
            // empty
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SocketTransport.prototype, "closed", {
        get: function () {
            return this.readyState === 3;
        },
        set: function (value) {
            // empty
        },
        enumerable: false,
        configurable: true
    });
    // -- public ---------------------------------------------------------- //
    SocketTransport.prototype.open = function () {
        this._socketOpen();
    };
    SocketTransport.prototype.send = function (socketMessage) {
        this._socketSend(socketMessage);
    };
    SocketTransport.prototype.close = function () {
        this._socketClose();
    };
    SocketTransport.prototype.on = function (event, callback) {
        this._events.push({ event: event, callback: callback });
    };
    // -- private ---------------------------------------------------------- //
    SocketTransport.prototype._socketOpen = function (forceOpen) {
        var _this = this;
        if ((typeof forceOpen !== 'undefined' && !forceOpen) || this._initiating) {
            return;
        }
        this._initiating = true;
        var bridge = this._bridge;
        this._setToQueue({
            topic: "" + this._clientId,
            type: 'sub',
            payload: '',
            silent: true
        });
        var url = bridge.startsWith('https')
            ? bridge.replace('https', 'wss')
            : bridge.startsWith('http')
                ? bridge.replace('http', 'ws')
                : bridge;
        var socket = new WebSocket(url);
        socket.onmessage = function (event) { return _this._socketReceive(event); };
        socket.onopen = function () {
            _this._trigger('open');
            _this._socketClose();
            _this._initiating = false;
            _this._socket = socket;
            _this._pushQueue();
        };
        socket.onclose = function () {
            _this._trigger('close');
            _this._socketOpen(true);
        };
    };
    SocketTransport.prototype._socketClose = function () {
        if (this._socket) {
            this._socket.onclose = function () {
                // empty
            };
            this._socket.close();
        }
    };
    SocketTransport.prototype._socketSend = function (socketMessage) {
        var message = JSON.stringify(socketMessage);
        if (this._socket && this.connected) {
            this._socket.send(message);
        }
        else {
            this._setToQueue(socketMessage);
            this._socketOpen();
        }
    };
    SocketTransport.prototype._socketReceive = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var socketMessage;
            return __generator(this, function (_a) {
                try {
                    socketMessage = JSON.parse(event.data);
                }
                catch (error) {
                    return [2 /*return*/];
                }
                if (this.connected) {
                    this._trigger('message', socketMessage);
                }
                return [2 /*return*/];
            });
        });
    };
    SocketTransport.prototype._setToQueue = function (socketMessage) {
        this._queue.push(socketMessage);
    };
    SocketTransport.prototype._pushQueue = function () {
        var _this = this;
        var queue = this._queue;
        queue.forEach(function (socketMessage) {
            return _this._socketSend(socketMessage);
        });
        this._queue = [];
    };
    SocketTransport.prototype._trigger = function (eventName, payload) {
        var events = this._events.filter(function (event) { return event.event === eventName; });
        if (events && events.length) {
            events.forEach(function (event) { return event.callback(payload); });
        }
    };
    return SocketTransport;
}());
exports.default = SocketTransport;
