"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@walletconnect/utils");
// -- localStorage --------------------------------------------------------- //
var storageId = 'walletconnect';
var storage = null;
if (typeof window !== 'undefined' &&
    typeof window.localStorage !== 'undefined') {
    storage = window.localStorage;
}
// -- WebStorage ----------------------------------------------------------- //
function getSession() {
    var session = null;
    var local = null;
    if (storage) {
        local = storage.getItem(storageId);
    }
    if (local && typeof local === 'string') {
        try {
            var json = JSON.parse(local);
            if (utils_1.isWalletConnectSession(json)) {
                session = json;
            }
        }
        catch (error) {
            return null;
        }
    }
    return session;
}
function setSession(session) {
    var local = JSON.stringify(session);
    if (storage) {
        storage.setItem(storageId, local);
    }
    return session;
}
function removeSession() {
    if (storage) {
        storage.removeItem(storageId);
    }
}
exports.default = {
    getSession: getSession,
    setSession: setSession,
    removeSession: removeSession
};
