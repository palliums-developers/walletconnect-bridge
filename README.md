# muti-sign demo

### example:
    finance create tx
    CTO/CEO get tx and sign it
    finance get signed txs and send to chain

### process:

#### 1. create tx:
    finance open web and use walletconnect login
    finance create tx and enter sign account address
    finance click submit(socket)
    data: token, finance address, tx, signature addresses
#### 2. deal with tx:
    backend get data from finance
    backend use redis save data
    backend push tx to sign address by firebase api
#### 3. sign tx:
    CEO/CTO sign tx and send signed tx to backend (calling backend api)
#### 4. deal with signed tx:
    backend send all signed tx to finance web (socket)
#### 5. send to chain:
    finance web get signed tx (socket)
    finance check signed and click submit(walletconnect) send to mobile
