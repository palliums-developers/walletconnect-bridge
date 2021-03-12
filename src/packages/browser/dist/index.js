"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// import Connector from '@walletconnect/core'
var index_1 = require("../../core/src/index");
// import { IWalletConnectOptions } from '../../types/index'
var webStorage_1 = require("./webStorage");
var cryptoLib = require("./webCrypto");
var WalletConnect = /** @class */ (function (_super) {
    __extends(WalletConnect, _super);
    function WalletConnect(opts) {
        return _super.call(this, cryptoLib, opts, null, webStorage_1.default) || this;
    }
    return WalletConnect;
}(index_1.default));
exports.default = WalletConnect;
