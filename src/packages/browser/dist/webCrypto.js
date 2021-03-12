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
exports.decrypt = exports.encrypt = exports.aesCbcDecrypt = exports.aesCbcEncrypt = exports.verifyHmac = exports.createHmac = exports.generateKey = exports.importKey = exports.exportKey = void 0;
var utils_1 = require("@walletconnect/utils");
var AES_ALGORITHM = 'AES-CBC';
var AES_LENGTH = 256;
var HMAC_ALGORITHM = 'SHA-256';
function exportKey(cryptoKey) {
    return __awaiter(this, void 0, void 0, function () {
        var buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, window.crypto.subtle.exportKey('raw', cryptoKey)];
                case 1:
                    buffer = _a.sent();
                    return [2 /*return*/, buffer];
            }
        });
    });
}
exports.exportKey = exportKey;
// export async function importKey (
//   buffer: ArrayBuffer,
//   type: string = AES_ALGORITHM
// ): Promise<CryptoKey> {
//   const algorithm: AesKeyAlgorithm | HmacImportParams =
//     type === AES_ALGORITHM
//       ? { length: AES_LENGTH, name: AES_ALGORITHM }
//       : {
//         hash: { name: HMAC_ALGORITHM },
//         name: 'HMAC'
//       }
//   const usages: string[] =
//     type === AES_ALGORITHM ? ['encrypt', 'decrypt'] : ['sign', 'verify']
//   const cryptoKey = await window.crypto.subtle.importKey(
//     'raw',
//     buffer,
//     algorithm,
//     true,
//     usages
//   )
//   return cryptoKey
// }
function importKey(buffer, type) {
    if (type === void 0) { type = AES_ALGORITHM; }
    return __awaiter(this, void 0, void 0, function () {
        var algorithm, usages, cryptoKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (type === AES_ALGORITHM) {
                        algorithm = { length: AES_LENGTH, name: AES_ALGORITHM };
                        usages = ['encrypt', 'decrypt'];
                    }
                    else {
                        algorithm = {
                            hash: { name: HMAC_ALGORITHM },
                            name: 'HMAC'
                        };
                        usages = ['sign', 'verify'];
                    }
                    return [4 /*yield*/, window.crypto.subtle.importKey("raw", buffer, algorithm, true, usages)];
                case 1:
                    cryptoKey = _a.sent();
                    return [2 /*return*/, cryptoKey];
            }
        });
    });
}
exports.importKey = importKey;
function generateKey(length) {
    return __awaiter(this, void 0, void 0, function () {
        var _length, cryptoKey, key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _length = length || 256;
                    return [4 /*yield*/, window.crypto.subtle.generateKey({
                            length: _length,
                            name: AES_ALGORITHM
                        }, true, ['encrypt', 'decrypt'])];
                case 1:
                    cryptoKey = _a.sent();
                    return [4 /*yield*/, exportKey(cryptoKey)];
                case 2:
                    key = _a.sent();
                    return [2 /*return*/, key];
            }
        });
    });
}
exports.generateKey = generateKey;
function createHmac(data, key) {
    return __awaiter(this, void 0, void 0, function () {
        var cryptoKey, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, importKey(key, 'HMAC')];
                case 1:
                    cryptoKey = _a.sent();
                    return [4 /*yield*/, window.crypto.subtle.sign({
                            length: 256,
                            name: 'HMAC'
                        }, cryptoKey, data)];
                case 2:
                    signature = _a.sent();
                    return [2 /*return*/, signature];
            }
        });
    });
}
exports.createHmac = createHmac;
function verifyHmac(payload, key) {
    return __awaiter(this, void 0, void 0, function () {
        var cipherText, iv, hmac, hmacHex, unsigned, chmac, chmacHex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cipherText = utils_1.convertHexToArrayBuffer(payload.data);
                    iv = utils_1.convertHexToArrayBuffer(payload.iv);
                    hmac = utils_1.convertHexToArrayBuffer(payload.hmac);
                    hmacHex = utils_1.convertArrayBufferToHex(hmac, true);
                    unsigned = utils_1.concatArrayBuffers(cipherText, iv);
                    return [4 /*yield*/, createHmac(unsigned, key)];
                case 1:
                    chmac = _a.sent();
                    chmacHex = utils_1.convertArrayBufferToHex(chmac, true);
                    if (utils_1.removeHexPrefix(hmacHex) === utils_1.removeHexPrefix(chmacHex)) {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
            }
        });
    });
}
exports.verifyHmac = verifyHmac;
function aesCbcEncrypt(data, key, iv) {
    return __awaiter(this, void 0, void 0, function () {
        var cryptoKey, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, importKey(key, AES_ALGORITHM)];
                case 1:
                    cryptoKey = _a.sent();
                    return [4 /*yield*/, window.crypto.subtle.encrypt({
                            iv: iv,
                            name: AES_ALGORITHM
                        }, cryptoKey, data)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.aesCbcEncrypt = aesCbcEncrypt;
function aesCbcDecrypt(data, key, iv) {
    return __awaiter(this, void 0, void 0, function () {
        var cryptoKey, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, importKey(key, AES_ALGORITHM)];
                case 1:
                    cryptoKey = _a.sent();
                    return [4 /*yield*/, window.crypto.subtle.decrypt({
                            iv: iv,
                            name: AES_ALGORITHM
                        }, cryptoKey, data)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.aesCbcDecrypt = aesCbcDecrypt;
function encrypt(data, key) {
    return __awaiter(this, void 0, void 0, function () {
        var iv, ivHex, contentString, content, cipherText, cipherTextHex, unsigned, hmac, hmacHex;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!key) {
                        throw new Error('Missing key: required for encryption');
                    }
                    return [4 /*yield*/, generateKey(128)];
                case 1:
                    iv = _a.sent();
                    ivHex = utils_1.convertArrayBufferToHex(iv, true);
                    contentString = JSON.stringify(data);
                    content = utils_1.convertUtf8ToArrayBuffer(contentString);
                    return [4 /*yield*/, aesCbcEncrypt(content, key, iv)];
                case 2:
                    cipherText = _a.sent();
                    cipherTextHex = utils_1.convertArrayBufferToHex(cipherText, true);
                    unsigned = utils_1.concatArrayBuffers(cipherText, iv);
                    return [4 /*yield*/, createHmac(unsigned, key)];
                case 3:
                    hmac = _a.sent();
                    hmacHex = utils_1.convertArrayBufferToHex(hmac, true);
                    return [2 /*return*/, {
                            data: cipherTextHex,
                            hmac: hmacHex,
                            iv: ivHex
                        }];
            }
        });
    });
}
exports.encrypt = encrypt;
function decrypt(payload, key) {
    return __awaiter(this, void 0, void 0, function () {
        var verified, cipherText, iv, buffer, utf8, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!key) {
                        throw new Error('Missing key: required for decryption');
                    }
                    return [4 /*yield*/, verifyHmac(payload, key)];
                case 1:
                    verified = _a.sent();
                    if (!verified) {
                        return [2 /*return*/, null];
                    }
                    cipherText = utils_1.convertHexToArrayBuffer(payload.data);
                    iv = utils_1.convertHexToArrayBuffer(payload.iv);
                    return [4 /*yield*/, aesCbcDecrypt(cipherText, key, iv)];
                case 2:
                    buffer = _a.sent();
                    utf8 = utils_1.convertArrayBufferToUtf8(buffer);
                    try {
                        data = JSON.parse(utf8);
                    }
                    catch (error) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, data];
            }
        });
    });
}
exports.decrypt = decrypt;
