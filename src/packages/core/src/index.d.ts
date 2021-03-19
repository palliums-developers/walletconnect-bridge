import {
  IConnector,
  ICryptoLib,
  ITransportLib,
  ISessionStorage,
  ISessionStatus,
  ISessionError,
  IJsonRpcResponseSuccess,
  IJsonRpcResponseError,
  IJsonRpcRequest,
  ITxData,
  IClientMeta,
  IWalletConnectOptions,
  IUpdateChainParams,
  IRequestOptions,
  IInternalRequestOptions,
} from "@walletconnect/types";
declare class Connector implements IConnector {
  private cryptoLib;
  private protocol;
  private version;
  private _bridge;
  private _key;
  private _nextKey;
  private _clientId;
  private _clientMeta;
  private _peerId;
  private _peerMeta;
  private _handshakeId;
  private _handshakeTopic;
  private _accounts;
  private _chainId;
  private _networkId;
  private _rpcUrl;
  private _transport;
  private _eventManager;
  private _connected;
  private _storage;
  constructor(
    cryptoLib: ICryptoLib,
    opts: IWalletConnectOptions,
    transport?: ITransportLib | null,
    storage?: ISessionStorage | null,
    clientMeta?: IClientMeta | null
  );
  set bridge(value: string);
  get bridge(): string;
  set key(value: string);
  get key(): string;
  set nextKey(value: string);
  get nextKey(): string;
  set clientId(value: string);
  get clientId(): string;
  set peerId(value: string);
  get peerId(): string;
  set clientMeta(value: IClientMeta);
  get clientMeta(): IClientMeta;
  set peerMeta(value: IClientMeta);
  get peerMeta(): IClientMeta;
  set handshakeTopic(value: string);
  get handshakeTopic(): string;
  set handshakeId(value: number);
  get handshakeId(): number;
  get uri(): string;
  set uri(value: string);
  set chainId(value: number);
  get chainId(): number;
  set networkId(value: number);
  get networkId(): number;
  set accounts(value: string[]);
  get accounts(): string[];
  set rpcUrl(value: string);
  get rpcUrl(): string;
  set connected(value: boolean);
  get connected(): boolean;
  set pending(value: boolean);
  get pending(): boolean;
  get session(): {
    connected: boolean;
    accounts: string[];
    chainId: number;
    bridge: string;
    key: string;
    clientId: string;
    clientMeta: IClientMeta;
    peerId: string;
    peerMeta: IClientMeta;
    handshakeId: number;
    handshakeTopic: string;
  };
  set session(value: {
    connected: boolean;
    accounts: string[];
    chainId: number;
    bridge: string;
    key: string;
    clientId: string;
    clientMeta: IClientMeta;
    peerId: string;
    peerMeta: IClientMeta;
    handshakeId: number;
    handshakeTopic: string;
  });
  on(
    event: string,
    callback: (error: Error | null, payload: any | null) => void
  ): void;
  createSession(opts?: { chainId: number }): Promise<void>;
  approveSession(sessionStatus: ISessionStatus): void;
  rejectSession(sessionError?: ISessionError): void;
  updateSession(sessionStatus: ISessionStatus): void;
  killSession(sessionError?: ISessionError): Promise<void>;
  sendTransaction(chain: string, tx: ITxData): Promise<any>;
  violas_multiSignRawTransaction(tx: any): Promise<any>;
  consoleLog(_temp: String): String;
  get_accounts(): Promise<any>;
  signTransaction(tx: ITxData): Promise<any>;
  signMessage(params: any[]): Promise<any>;
  signPersonalMessage(params: any[]): Promise<any>;
  signTypedData(params: any[]): Promise<any>;
  updateChain(chainParams: IUpdateChainParams): Promise<any>;
  unsafeSend(
    request: IJsonRpcRequest,
    options?: IRequestOptions
  ): Promise<IJsonRpcResponseSuccess | IJsonRpcResponseError>;
  sendCustomRequest(
    request: Partial<IJsonRpcRequest>,
    options?: IRequestOptions
  ): Promise<any>;
  approveRequest(response: Partial<IJsonRpcResponseSuccess>): void;
  rejectRequest(response: Partial<IJsonRpcResponseError>): void;
  protected _get_accounts(request: any): Promise<void>;
  protected _sendRequest(
    request: Partial<IJsonRpcRequest>,
    options?: Partial<IInternalRequestOptions>
  ): Promise<void>;
  protected _sendResponse(
    response: IJsonRpcResponseSuccess | IJsonRpcResponseError
  ): Promise<void>;
  protected _sendSessionRequest(
    request: IJsonRpcRequest,
    errorMsg: string,
    options?: IInternalRequestOptions
  ): Promise<void>;
  protected _sendCallRequest(
    request: IJsonRpcRequest,
    options?: IRequestOptions
  ): Promise<any>;
  protected _formatRequest(request: Partial<IJsonRpcRequest>): IJsonRpcRequest;
  protected _formatResponse(
    response: Partial<IJsonRpcResponseSuccess | IJsonRpcResponseError>
  ): IJsonRpcResponseSuccess | IJsonRpcResponseError;
  private _handleSessionDisconnect;
  private _handleSessionResponse;
  private _handleIncomingMessages;
  private _subscribeToSessionRequest;
  private _subscribeToResponse;
  private _subscribeToSessionResponse;
  private _subscribeToCallResponse;
  private _subscribeToInternalEvents;
  private _formatUri;
  private _parseUri;
  private _generateKey;
  private _encrypt;
  private _decrypt;
  private _getStorageSession;
  private _setStorageSession;
  private _removeStorageSession;
  private _manageStorageSession;
}
export default Connector;
