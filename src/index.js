import React, { Component } from "react";
import ReactDOM from "react-dom";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnect from "./packages/browser/dist/index";
import webStorage from "./packages/browser/dist/webStorage";
import { Button, Input } from "antd";
import io from "socket.io-client";
import "./sass/index.scss";
let url = "http://localhost:3372";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      walletConnector: {},
      bridge: "https://walletconnect.violas.io",
      num_address: 0,
      num_signature: 0,
      addresses: [],
      signatures: [],
      tx: {},
      warning: "",
    };
  }
  componentDidMount = async () => {
    let wc_session = JSON.parse(localStorage.getItem("walletconnect"));
    if (wc_session && wc_session.connected) {
      await this.setState({
        walletConnector: new WalletConnect({ session: wc_session }),
      });
    } else {
      await this.getNewWalletConnect();
    }
  };
  getNewWalletConnect = async () => {
    await this.setState({
      walletConnector: new WalletConnect({ bridge: this.state.bridge }),
    });
  };
  QRCode = () => {
    if (!this.state.walletConnector.connected) {
      this.state.walletConnector.createSession().then(() => {
        const uri = this.state.walletConnector.uri;
        webStorage.setSession(this.state.walletConnector.session);
        WalletConnectQRCodeModal.open(uri, () => {
          console.log("QRCode closed");
        });
      });
    }
    this.state.walletConnector.on("connect", async (error, payload) => {
      if (error) {
        throw error;
      }
      WalletConnectQRCodeModal.close();
      this.getAccount();
      const { accounts, chainId } = payload.params[0];
      console.log("you have connected ", accounts[0], chainId);
      this.forceUpdate();
    });
    this.state.walletConnector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }
      const { accounts, chainId } = payload.params[0];
      console.log("session update ", accounts, chainId);
    });
    this.state.walletConnector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }
      console.log("wallet disconnected " + JSON.stringify(payload));
    });
  };
  disconnectWC = async () => {
    await this.state.walletConnector.killSession();
    await this.setState({ walletConnector: {} });
    await this.getNewWalletConnect();
    await sessionStorage.clear();
  };
  getAccount = () => {
    this.state.walletConnector.get_accounts().then(async (res) => {
      console.log("get account ", res);
    });
  };
  onChangeAddress = async (e) => {
    let temp = e.target.value.split("\n");
    for (let i in temp) {
      if (temp[i].length !== 32) {
        await this.setState({ warning: "Wrong address format" });
        break;
      } else {
        await this.setState({ warning: "" });
      }
    }
    await this.setState({ addresses: temp, num_address: temp.length });
  };
  onChangeTx = async (type, value) => {
    let temp_tx = this.state.tx;
    switch (type) {
      case "address":
        temp_tx.address = value;
        break;
    }
  };
  getToken = async () => {
    let token = sessionStorage.getItem("express_token");
    if (token) {
      token = new Date().getTime();
    }
  };
  send_address = () => {
    // 连接服务器, 得到与服务器的连接对象
    // let socket = io(`ws://${url}`);
    // let socket = io.connect(url);
    // // 绑定监听, 接收服务器发送的消息
    // socket.on("receiveMsg", function(data) {
    //   console.log("客户端接收服务器发送的消息", data);
    // });
    // // 发送消息
    // socket.emit("sendMsg", { name: "abc" });
    let rend_data = {
      token: "111",
    };
    if (this.state.warning === "") {
      let socket = io.connect(url);
      socket.on("connect", function(data) {
        socket.emit("join", "Hello World from client");
        socket.on("messages", function(data) {
          console.log(data);
        });
      });
    }
    console.log("send tx to backend");
  };
  render() {
    return (
      <div className="main">
        <h2>Multi-sign WalletConnect Demo</h2>
        <div className="walletconnect">
          <Button onClick={this.QRCode}>Link to WalletConnect</Button>
          <Button onClick={this.disconnectWC}>
            Disconnect with WalletConnect
          </Button>
        </div>
        {this.state.walletConnector.connected && (
          <div className="operation">
            <p>Generate transaction</p>
            <Input></Input>
            <p>Signature Address:</p>
            <textarea
              onChange={this.onChangeAddress}
              style={{ width: "500px", height: "400px" }}
              // autoSize={{ minRows: 10, maxRows: 32 }}
              wrap="hard"
            />
            <p style={{ color: "red" }}>{this.state.warning}</p>
            <p>Address number: {this.state.num_address}</p>
            <Button type="primary" onClick={this.send_address}>
              Start multi-signature
            </Button>
            <p>Signature number: {this.state.num_signature}</p>
            <Button type="primary">Send to finance phone</Button>
          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
