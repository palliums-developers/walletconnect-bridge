"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
// import {
//   IConnector,
//   ICryptoLib,
//   ITransportLib,
//   ISessionStorage,
//   IEncryptionPayload,
//   ISocketMessage,
//   ISessionStatus,
//   ISessionError,
//   IJsonRpcResponseSuccess,
//   IJsonRpcResponseError,
//   IJsonRpcRequest,
//   ITxData,
//   IClientMeta,
//   IParseURIResult,
//   ISessionParams,
//   IWalletConnectOptions,
//   IUpdateChainParams,
//   IRequestOptions,
//   IInternalRequestOptions
// } from '../../types/index/types'
var utils_1 = require("@walletconnect/utils");
var errors_1 = require("./errors");
var socket_1 = require("./socket");
var events_1 = require("./events");
// -- Connector ------------------------------------------------------------ //
var Connector = /** @class */ (function () {
    // -- constructor ----------------------------------------------------- //
    function Connector(cryptoLib, opts, transport, storage, clientMeta) {
        this.cryptoLib = cryptoLib;
        this.protocol = 'wc';
        this.version = 1;
        this._bridge = '';
        this._key = null;
        this._nextKey = null;
        this._clientId = '';
        this._clientMeta = null;
        this._peerId = '';
        this._peerMeta = null;
        this._handshakeId = 0;
        this._handshakeTopic = '';
        this._accounts = [];
        this._chainId = 0;
        this._networkId = 0;
        this._rpcUrl = '';
        this._eventManager = new events_1.default();
        this._connected = false;
        this._storage = storage || null;
        if (clientMeta) {
            this.clientMeta = clientMeta;
        }
        if (!opts.bridge && !opts.uri && !opts.session) {
            throw new Error(errors_1.ERROR_MISSING_REQUIRED);
        }
        if (opts.bridge) {
            this.bridge = opts.bridge;
        }
        if (opts.uri) {
            this.uri = opts.uri;
        }
        var session = opts.session || null;
        if (!session) {
            session = this._getStorageSession();
        }
        if (session) {
            this.session = session;
        }
        if (this.handshakeId) {
            this._subscribeToSessionResponse(this.handshakeId, 'Session request rejected');
        }
        this._transport =
            transport ||
                new socket_1.default({ bridge: this.bridge, clientId: this.clientId });
        if (opts.uri) {
            this._subscribeToSessionRequest();
        }
        this._subscribeToInternalEvents();
        this._transport.open();
    }
    Object.defineProperty(Connector.prototype, "bridge", {
        get: function () {
            return this._bridge;
        },
        // -- setters / getters ----------------------------------------------- //
        set: function (value) {
            if (!value) {
                return;
            }
            this._bridge = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "key", {
        get: function () {
            if (this._key) {
                var key = utils_1.convertArrayBufferToHex(this._key, true);
                return key;
            }
            return '';
        },
        set: function (value) {
            if (!value) {
                return;
            }
            var key = utils_1.convertHexToArrayBuffer(value);
            this._key = key;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "nextKey", {
        get: function () {
            if (this._nextKey) {
                var nextKey = utils_1.convertArrayBufferToHex(this._nextKey);
                return nextKey;
            }
            return '';
        },
        set: function (value) {
            if (!value) {
                return;
            }
            var nextKey = utils_1.convertHexToArrayBuffer(value);
            this._nextKey = nextKey;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "clientId", {
        get: function () {
            var clientId = this._clientId;
            if (!clientId) {
                clientId = this._clientId = utils_1.uuid();
            }
            return this._clientId;
        },
        set: function (value) {
            if (!value) {
                return;
            }
            this._clientId = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "peerId", {
        get: function () {
            return this._peerId;
        },
        set: function (value) {
            if (!value) {
                return;
            }
            this._peerId = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "clientMeta", {
        get: function () {
            var clientMeta = this._clientMeta;
            if (!clientMeta) {
                clientMeta = this._clientMeta = utils_1.getMeta();
            }
            return clientMeta;
        },
        set: function (value) {
            // empty
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "peerMeta", {
        get: function () {
            var peerMeta = this._peerMeta;
            return peerMeta;
        },
        set: function (value) {
            this._peerMeta = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "handshakeTopic", {
        get: function () {
            return this._handshakeTopic;
        },
        set: function (value) {
            if (!value) {
                return;
            }
            this._handshakeTopic = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "handshakeId", {
        get: function () {
            return this._handshakeId;
        },
        set: function (value) {
            if (!value) {
                return;
            }
            this._handshakeId = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "uri", {
        get: function () {
            var _uri = this._formatUri();
            return _uri;
        },
        set: function (value) {
            if (!value) {
                return;
            }
            var _a = this._parseUri(value), handshakeTopic = _a.handshakeTopic, bridge = _a.bridge, key = _a.key;
            this.handshakeTopic = handshakeTopic;
            this.bridge = bridge;
            this.key = key;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "chainId", {
        get: function () {
            var chainId = this._chainId;
            return chainId;
        },
        set: function (value) {
            this._chainId = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "networkId", {
        get: function () {
            var networkId = this._networkId;
            return networkId;
        },
        set: function (value) {
            this._networkId = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "accounts", {
        get: function () {
            var accounts = this._accounts;
            return accounts;
        },
        set: function (value) {
            this._accounts = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "rpcUrl", {
        get: function () {
            var rpcUrl = this._rpcUrl;
            return rpcUrl;
        },
        set: function (value) {
            this._rpcUrl = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "connected", {
        get: function () {
            return this._connected;
        },
        set: function (value) {
            // empty
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "pending", {
        get: function () {
            return !!this._handshakeTopic;
        },
        set: function (value) {
            // empty
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connector.prototype, "session", {
        get: function () {
            return {
                connected: this.connected,
                accounts: this.accounts,
                chainId: this.chainId,
                bridge: this.bridge,
                key: this.key,
                clientId: this.clientId,
                clientMeta: this.clientMeta,
                peerId: this.peerId,
                peerMeta: this.peerMeta,
                handshakeId: this.handshakeId,
                handshakeTopic: this.handshakeTopic
            };
        },
        set: function (value) {
            if (!value) {
                return;
            }
            this._connected = value.connected;
            this.accounts = value.accounts;
            this.chainId = value.chainId;
            this.bridge = value.bridge;
            this.key = value.key;
            this.clientId = value.clientId;
            this.clientMeta = value.clientMeta;
            this.peerId = value.peerId;
            this.peerMeta = value.peerMeta;
            this.handshakeId = value.handshakeId;
            this.handshakeTopic = value.handshakeTopic;
        },
        enumerable: false,
        configurable: true
    });
    // -- public ---------------------------------------------------------- //
    Connector.prototype.on = function (event, callback) {
        var eventEmitter = {
            event: event,
            callback: callback
        };
        this._eventManager.subscribe(eventEmitter);
    };
    Connector.prototype.createSession = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, request;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this._connected) {
                            throw new Error(errors_1.ERROR_SESSION_CONNECTED);
                        }
                        if (this.pending) {
                            return [2 /*return*/];
                        }
                        _a = this;
                        return [4 /*yield*/, this._generateKey()];
                    case 1:
                        _a._key = _b.sent();
                        request = this._formatRequest({
                            method: 'wc_sessionRequest',
                            params: [
                                {
                                    peerId: this.clientId,
                                    peerMeta: this.clientMeta,
                                    chainId: opts && opts.chainId ? opts.chainId : null
                                }
                            ]
                        });
                        this.handshakeId = request.id;
                        this.handshakeTopic = utils_1.uuid();
                        this._sendSessionRequest(request, 'Session update rejected', { topic: this.handshakeTopic });
                        this._eventManager.trigger({
                            event: 'display_uri',
                            params: [this.uri]
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Connector.prototype.approveSession = function (sessionStatus) {
        if (this._connected) {
            throw new Error(errors_1.ERROR_SESSION_CONNECTED);
        }
        this.chainId = sessionStatus.chainId;
        this.accounts = sessionStatus.accounts;
        this.networkId = sessionStatus.networkId || 0;
        this.rpcUrl = sessionStatus.rpcUrl || '';
        var sessionParams = {
            approved: true,
            chainId: this.chainId,
            networkId: this.networkId,
            accounts: this.accounts,
            rpcUrl: this.rpcUrl,
            peerId: this.clientId,
            peerMeta: this.clientMeta
        };
        var response = {
            id: this.handshakeId,
            jsonrpc: '2.0',
            result: sessionParams
        };
        this._sendResponse(response);
        this._connected = true;
        this._eventManager.trigger({
            event: 'connect',
            params: [
                {
                    peerId: this.peerId,
                    peerMeta: this.peerMeta,
                    chainId: this.chainId,
                    accounts: this.accounts
                }
            ]
        });
        if (this._connected) {
            this._setStorageSession();
        }
    };
    Connector.prototype.rejectSession = function (sessionError) {
        if (this._connected) {
            throw new Error(errors_1.ERROR_SESSION_CONNECTED);
        }
        var message = sessionError && sessionError.message
            ? sessionError.message
            : errors_1.ERROR_SESSION_REJECTED;
        var response = this._formatResponse({
            id: this.handshakeId,
            error: { message: message }
        });
        this._sendResponse(response);
        this._connected = false;
        this._eventManager.trigger({
            event: 'disconnect',
            params: [{ message: message }]
        });
        this._removeStorageSession();
    };
    Connector.prototype.updateSession = function (sessionStatus) {
        if (!this._connected) {
            throw new Error(errors_1.ERROR_SESSION_DISCONNECTED);
        }
        this.chainId = sessionStatus.chainId;
        this.accounts = sessionStatus.accounts;
        this.networkId = sessionStatus.networkId || 0;
        this.rpcUrl = sessionStatus.rpcUrl || '';
        var sessionParams = {
            approved: true,
            chainId: this.chainId,
            networkId: this.networkId,
            accounts: this.accounts,
            rpcUrl: this.rpcUrl
        };
        var request = this._formatRequest({
            method: 'wc_sessionUpdate',
            params: [sessionParams]
        });
        this._sendSessionRequest(request, 'Session update rejected');
        this._eventManager.trigger({
            event: 'session_update',
            params: [
                {
                    chainId: this.chainId,
                    accounts: this.accounts
                }
            ]
        });
        this._manageStorageSession();
    };
    Connector.prototype.killSession = function (sessionError) {
        return __awaiter(this, void 0, void 0, function () {
            var message, sessionParams, request;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = sessionError ? sessionError.message : 'Session Disconnected';
                        sessionParams = {
                            approved: false,
                            chainId: null,
                            networkId: null,
                            accounts: null
                        };
                        request = this._formatRequest({
                            method: 'wc_sessionUpdate',
                            params: [sessionParams]
                        });
                        return [4 /*yield*/, this._sendRequest(request)];
                    case 1:
                        _a.sent();
                        this._handleSessionDisconnect(message);
                        return [2 /*return*/];
                }
            });
        });
    };
    // public async sendTransaction (tx: ITxData) {
    //   if (!this._connected) {
    //     throw new Error(ERROR_SESSION_DISCONNECTED)
    //   }
    //   const parsedTx = parseTransactionData(tx)
    //   const request = this._formatRequest({
    //     method: 'eth_sendTransaction',
    //     params: [parsedTx]
    //   })
    //   try {
    //     const result = await this._sendCallRequest(request)
    //     return result
    //   } catch (error) {
    //     throw error
    //   }
    // }
    Connector.prototype.sendTransaction = function (chain, tx) {
        return __awaiter(this, void 0, void 0, function () {
            var request, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._connected) {
                            throw new Error(errors_1.ERROR_SESSION_DISCONNECTED);
                        }
                        request = this._formatRequest({
                            method: chain + '_sendTransaction',
                            params: [tx]
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._sendCallRequest(request)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _a.sent();
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Connector.prototype.violas_multiSignRawTransaction = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var request, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._connected) {
                            throw new Error(errors_1.ERROR_SESSION_DISCONNECTED);
                        }
                        request = this._formatRequest({
                            method: 'violas_multiSignRawTransaction',
                            params: [tx]
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._sendCallRequest(request)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_2 = _a.sent();
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Connector.prototype.consoleLog = function (_temp) {
        return _temp;
    };
    Connector.prototype.get_accounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._connected) {
                            throw new Error(errors_1.ERROR_SESSION_DISCONNECTED);
                        }
                        request = this._formatRequest({
                            method: '_get_accounts',
                            params: []
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._sendCallRequest(request)
                            // const result = await this._get_accounts(request)
                        ];
                    case 2:
                        result = _a.sent();
                        // const result = await this._get_accounts(request)
                        return [2 /*return*/, result];
                    case 3:
                        error_3 = _a.sent();
                        throw error_3;
                    case 4:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    // public async signTransaction(tx: ITxData) {
    //   if (!this._connected) {
    //     throw new Error(ERROR_SESSION_DISCONNECTED)
    //   }
    //   const parsedTx = parseTransactionData(tx)
    //   const request = this._formatRequest({
    //     method: 'eth_signTransaction',
    //     params: [parsedTx]
    //   })
    //   try {
    //     const result = await this._sendCallRequest(request)
    //     return result
    //   } catch (error) {
    //     throw error
    //   }
    // }
    Connector.prototype.signTransaction = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var request, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._connected) {
                            throw new Error(errors_1.ERROR_SESSION_DISCONNECTED);
                        }
                        request = this._formatRequest({
                            method: 'violas_signTransaction',
                            params: [tx]
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._sendCallRequest(request)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_4 = _a.sent();
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Connector.prototype.signMessage = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var request, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._connected) {
                            throw new Error(errors_1.ERROR_SESSION_DISCONNECTED);
                        }
                        request = this._formatRequest({
                            method: 'eth_sign',
                            params: params
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._sendCallRequest(request)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_5 = _a.sent();
                        throw error_5;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Connector.prototype.signPersonalMessage = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var request, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._connected) {
                            throw new Error(errors_1.ERROR_SESSION_DISCONNECTED);
                        }
                        params = utils_1.parsePersonalSign(params);
                        request = this._formatRequest({
                            method: 'personal_sign',
                            params: params
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._sendCallRequest(request)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_6 = _a.sent();
                        throw error_6;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Connector.prototype.signTypedData = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var request, result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._connected) {
                            throw new Error(errors_1.ERROR_SESSION_DISCONNECTED);
                        }
                        request = this._formatRequest({
                            method: 'eth_signTypedData',
                            params: params
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._sendCallRequest(request)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_7 = _a.sent();
                        throw error_7;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Connector.prototype.updateChain = function (chainParams) {
        return __awaiter(this, void 0, void 0, function () {
            var request, result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._connected) {
                            throw new Error('Session currently disconnected');
                        }
                        request = this._formatRequest({
                            method: 'wallet_updateChain',
                            params: [chainParams]
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._sendCallRequest(request)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_8 = _a.sent();
                        throw error_8;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Connector.prototype.unsafeSend = function (request, options) {
        var _this = this;
        this._sendRequest(request, options);
        return new Promise(function (resolve, reject) {
            _this._subscribeToResponse(request.id, function (error, payload) {
                if (error) {
                    reject(error);
                    return;
                }
                if (!payload) {
                    throw new Error(errors_1.ERROR_MISSING_JSON_RPC);
                }
                resolve(payload);
            });
        });
    };
    Connector.prototype.sendCustomRequest = function (request, options) {
        return __awaiter(this, void 0, void 0, function () {
            var formattedRequest, result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._connected) {
                            throw new Error(errors_1.ERROR_SESSION_DISCONNECTED);
                        }
                        switch (request.method) {
                            case 'eth_accounts':
                                return [2 /*return*/, this.accounts];
                            case 'eth_chainId':
                                return [2 /*return*/, utils_1.convertNumberToHex(this.chainId)];
                            case 'eth_sendTransaction':
                            case 'eth_signTransaction':
                                if (request.params) {
                                    request.params[0] = utils_1.parseTransactionData(request.params[0]);
                                }
                                break;
                            case 'personal_sign':
                                if (request.params) {
                                    request.params = utils_1.parsePersonalSign(request.params);
                                }
                                break;
                            default:
                                break;
                        }
                        formattedRequest = this._formatRequest(request);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._sendCallRequest(formattedRequest, options)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_9 = _a.sent();
                        throw error_9;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Connector.prototype.approveRequest = function (response) {
        if (utils_1.isJsonRpcResponseSuccess(response)) {
            var formattedResponse = this._formatResponse(response);
            this._sendResponse(formattedResponse);
        }
        else {
            throw new Error(errors_1.ERROR_MISSING_RESULT);
        }
    };
    Connector.prototype.rejectRequest = function (response) {
        if (utils_1.isJsonRpcResponseError(response)) {
            var formattedResponse = this._formatResponse(response);
            this._sendResponse(formattedResponse);
        }
        else {
            throw new Error(errors_1.ERROR_MISSING_ERROR);
        }
    };
    // -- private --------------------------------------------------------- //
    Connector.prototype._get_accounts = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('_get');
                this._transport.send(request);
                return [2 /*return*/];
            });
        });
    };
    Connector.prototype._sendRequest = function (request, options) {
        return __awaiter(this, void 0, void 0, function () {
            var callRequest, encryptionPayload, topic, payload, silent, socketMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        callRequest = this._formatRequest(request);
                        return [4 /*yield*/, this._encrypt(callRequest)];
                    case 1:
                        encryptionPayload = _a.sent();
                        topic = typeof (options === null || options === void 0 ? void 0 : options.topic) !== 'undefined' ? options.topic : this.peerId;
                        payload = JSON.stringify(encryptionPayload);
                        silent = typeof (options === null || options === void 0 ? void 0 : options.forcePushNotification) !== 'undefined' ? !options.forcePushNotification : utils_1.isSilentPayload(callRequest);
                        socketMessage = {
                            topic: topic,
                            type: 'pub',
                            payload: payload,
                            silent: silent
                        };
                        this._transport.send(socketMessage);
                        return [2 /*return*/];
                }
            });
        });
    };
    Connector.prototype._sendResponse = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var encryptionPayload, topic, payload, socketMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._encrypt(response)];
                    case 1:
                        encryptionPayload = _a.sent();
                        topic = this.peerId;
                        payload = JSON.stringify(encryptionPayload);
                        socketMessage = {
                            topic: topic,
                            type: 'pub',
                            payload: payload,
                            silent: true
                        };
                        this._transport.send(socketMessage);
                        return [2 /*return*/];
                }
            });
        });
    };
    Connector.prototype._sendSessionRequest = function (request, errorMsg, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._sendRequest(request, options);
                this._subscribeToSessionResponse(request.id, errorMsg);
                return [2 /*return*/];
            });
        });
    };
    Connector.prototype._sendCallRequest = function (request, options) {
        this._sendRequest(request, options);
        return this._subscribeToCallResponse(request.id);
    };
    Connector.prototype._formatRequest = function (request) {
        if (typeof request.method === 'undefined') {
            throw new Error(errors_1.ERROR_MISSING_METHOD);
        }
        var formattedRequest = {
            id: typeof request.id === 'undefined' ? utils_1.payloadId() : request.id,
            jsonrpc: '2.0',
            method: request.method,
            params: typeof request.params === 'undefined' ? [] : request.params
        };
        return formattedRequest;
    };
    Connector.prototype._formatResponse = function (response) {
        if (typeof response.id === 'undefined') {
            throw new Error(errors_1.ERROR_MISSING_ID);
        }
        if (utils_1.isJsonRpcResponseError(response)) {
            var error = utils_1.formatRpcError(response.error);
            var errorResponse = {
                id: response.id,
                jsonrpc: '2.0',
                // ...response,
                error: error
            };
            return errorResponse;
        }
        else if (utils_1.isJsonRpcResponseSuccess(response)) {
            var successResponse = {
                id: response.id,
                jsonrpc: '2.0',
                // ...response
                result: response.result
            };
            return successResponse;
        }
        throw new Error(errors_1.ERROR_INVALID_RESPONSE);
    };
    Connector.prototype._handleSessionDisconnect = function (errorMsg) {
        var message = errorMsg || 'Session Disconnected';
        if (this._connected) {
            this._connected = false;
        }
        this._eventManager.trigger({
            event: 'disconnect',
            params: [{ message: message }]
        });
        this._removeStorageSession();
        this._transport.close();
    };
    Connector.prototype._handleSessionResponse = function (errorMsg, sessionParams) {
        if (sessionParams) {
            if (sessionParams.approved) {
                if (!this._connected) {
                    this._connected = true;
                    if (sessionParams.chainId) {
                        this.chainId = sessionParams.chainId;
                    }
                    if (sessionParams.accounts) {
                        this.accounts = sessionParams.accounts;
                    }
                    if (sessionParams.peerId && !this.peerId) {
                        this.peerId = sessionParams.peerId;
                    }
                    if (sessionParams.peerMeta && !this.peerMeta) {
                        this.peerMeta = sessionParams.peerMeta;
                    }
                    this._eventManager.trigger({
                        event: 'connect',
                        params: [
                            {
                                peerId: this.peerId,
                                peerMeta: this.peerMeta,
                                chainId: this.chainId,
                                accounts: this.accounts
                            }
                        ]
                    });
                }
                else {
                    if (sessionParams.chainId) {
                        this.chainId = sessionParams.chainId;
                    }
                    if (sessionParams.accounts) {
                        this.accounts = sessionParams.accounts;
                    }
                    this._eventManager.trigger({
                        event: 'session_update',
                        params: [
                            {
                                chainId: this.chainId,
                                accounts: this.accounts
                            }
                        ]
                    });
                }
                this._manageStorageSession();
            }
            else {
                this._handleSessionDisconnect(errorMsg);
            }
        }
        else {
            this._handleSessionDisconnect(errorMsg);
        }
    };
    Connector.prototype._handleIncomingMessages = function (socketMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var activeTopics, encryptionPayload, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activeTopics = [this.clientId, this.handshakeTopic];
                        if (!activeTopics.includes(socketMessage.topic)) {
                            return [2 /*return*/];
                        }
                        try {
                            encryptionPayload = JSON.parse(socketMessage.payload);
                        }
                        catch (error) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this._decrypt(encryptionPayload)];
                    case 1:
                        payload = _a.sent();
                        if (payload) {
                            this._eventManager.trigger(payload);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Connector.prototype._subscribeToSessionRequest = function () {
        this._transport.send({
            topic: "" + this.handshakeTopic,
            type: 'sub',
            payload: '',
            silent: true
        });
    };
    Connector.prototype._subscribeToResponse = function (id, callback) {
        this.on("response:" + id, callback);
    };
    Connector.prototype._subscribeToSessionResponse = function (id, errorMsg) {
        var _this = this;
        this._subscribeToResponse(id, function (error, payload) {
            if (error) {
                _this._handleSessionResponse(error.message);
                return;
            }
            if (payload.result) {
                _this._handleSessionResponse(errorMsg, payload.result);
            }
            else if (payload.error && payload.error.message) {
                _this._handleSessionResponse(payload.error.message);
            }
            else {
                _this._handleSessionResponse(errorMsg);
            }
        });
    };
    Connector.prototype._subscribeToCallResponse = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._subscribeToResponse(id, function (error, payload) {
                if (error) {
                    reject(error);
                    return;
                }
                if (payload.result) {
                    resolve(payload.result);
                }
                else if (payload.error && payload.error.message) {
                    reject(new Error(payload.error.message));
                }
                else {
                    reject(new Error(errors_1.ERROR_INVALID_RESPONSE));
                }
            });
        });
    };
    Connector.prototype._subscribeToInternalEvents = function () {
        var _this = this;
        this._transport.on('message', function (socketMessage) {
            return _this._handleIncomingMessages(socketMessage);
        });
        this._transport.on('open', function () {
            return _this._eventManager.trigger({ event: 'transport_open', params: [] });
        });
        this._transport.on('close', function () {
            return _this._eventManager.trigger({ event: 'transport_close', params: [] });
        });
        this.on('wc_sessionRequest', function (error, payload) {
            if (error) {
                _this._eventManager.trigger({
                    event: 'error',
                    params: [
                        {
                            code: 'SESSION_REQUEST_ERROR',
                            message: error.toString()
                        }
                    ]
                });
            }
            _this.handshakeId = payload.id;
            _this.peerId = payload.params[0].peerId;
            _this.peerMeta = payload.params[0].peerMeta;
            var internalPayload = __assign(__assign({}, payload), { method: 'session_request' });
            _this._eventManager.trigger(internalPayload);
        });
        this.on('wc_sessionUpdate', function (error, payload) {
            if (error) {
                _this._handleSessionResponse(error.message);
            }
            _this._handleSessionResponse('Session disconnected', payload.params[0]);
        });
    };
    // -- uri ------------------------------------------------------------- //
    Connector.prototype._formatUri = function () {
        var protocol = this.protocol;
        var handshakeTopic = this.handshakeTopic;
        var version = this.version;
        var bridge = encodeURIComponent(this.bridge);
        var key = this.key;
        var uri = protocol + ":" + handshakeTopic + "@" + version + "?bridge=" + bridge + "&key=" + key;
        return uri;
    };
    Connector.prototype._parseUri = function (uri) {
        var result = utils_1.parseWalletConnectUri(uri);
        if (result.protocol === this.protocol) {
            if (!result.handshakeTopic) {
                throw Error('Invalid or missing handshakeTopic parameter value');
            }
            var handshakeTopic = result.handshakeTopic;
            if (!result.bridge) {
                throw Error('Invalid or missing bridge url parameter value');
            }
            var bridge = decodeURIComponent(result.bridge);
            if (!result.key) {
                throw Error('Invalid or missing kkey parameter value');
            }
            var key = result.key;
            return { handshakeTopic: handshakeTopic, bridge: bridge, key: key };
        }
        else {
            throw new Error(errors_1.ERROR_INVALID_URI);
        }
    };
    // -- crypto ---------------------------------------------------------- //
    Connector.prototype._generateKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.cryptoLib) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cryptoLib.generateKey()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2: return [2 /*return*/, null];
                }
            });
        });
    };
    Connector.prototype._encrypt = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var key, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this._key;
                        if (!(this.cryptoLib && key)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cryptoLib.encrypt(data, key)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2: return [2 /*return*/, null];
                }
            });
        });
    };
    Connector.prototype._decrypt = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var key, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this._key;
                        if (!(this.cryptoLib && key)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cryptoLib.decrypt(payload, key)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2: return [2 /*return*/, null];
                }
            });
        });
    };
    // -- storage --------------------------------------------------------- //
    Connector.prototype._getStorageSession = function () {
        var result = null;
        if (this._storage) {
            result = this._storage.getSession();
        }
        return result;
    };
    Connector.prototype._setStorageSession = function () {
        if (this._storage) {
            this._storage.setSession(this.session);
        }
    };
    Connector.prototype._removeStorageSession = function () {
        if (this._storage) {
            this._storage.removeSession();
        }
    };
    Connector.prototype._manageStorageSession = function () {
        if (this._connected) {
            this._setStorageSession();
        }
        else {
            this._removeStorageSession();
        }
    };
    return Connector;
}());
exports.default = Connector;
