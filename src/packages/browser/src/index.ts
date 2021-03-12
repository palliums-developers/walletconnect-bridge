// import Connector from '@walletconnect/core'
import Connector from '../../core/src/index'
import { IWalletConnectOptions } from '@walletconnect/types'
// import { IWalletConnectOptions } from '../../types/index'
import WebStorage from './webStorage'
import * as cryptoLib from './webCrypto'

class WalletConnect extends Connector {
  constructor (opts: IWalletConnectOptions) {
    super(cryptoLib, opts, null, WebStorage)
  }
}

export default WalletConnect
