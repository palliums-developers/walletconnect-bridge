import React, { Component } from "react";
import ReactDOM from "react-dom";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnect from "./packages/browser/dist/index";
import webStorage from "./packages/browser/dist/webStorage";
import { Button, Input, Select } from "antd";
import io from "socket.io-client";
import { socket_url, api_url, tx_config } from "./config";
import { getViolasTyArgs } from "./util/trans.js";
import axios from "axios";
import "./sass/index.scss";
import "antd/dist/antd.css";
// let socket_url = "http://localhost:3372";
// let api_url = "https://api4.violas.io";
const { Option } = Select;
const { TextArea } = Input;
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
      coinList: [],
      tx: { receive_address: "", coin_name: "", send_amount: "" },
      warning: "",
    };
  }
  getCoinName = async () => {
    await axios
      .get(api_url + "/1.0/violas/currency")
      .then((res) => {
        this.setState({ coinList: res.data.data.currencies });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount = async () => {
    this.getCoinName();
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
      case "receive_address":
        temp_tx.receive_address = value;
        break;
      case "coin_name":
        temp_tx.coin_name = value;
        break;
      case "send_amount":
        temp_tx.send_amount = value;
        break;
      default:
        break;
    }
  };
  generateTx = () => {
    const tx = {
      from: this.state.walletConnector.accounts,
      payload: {
        code: tx_config.p2p,
        tyArgs: [
          getViolasTyArgs(this.state.tx.coin_name, this.state.tx.coin_name),
        ],
        args: [
          {
            type: "Address",
            value: this.state.tx.receive_address,
          },
          {
            type: "U64",
            value: this.state.tx.send_amount,
          },
          {
            type: "Vector",
            value: "",
          },
          {
            type: "Vector",
            value: "",
          },
        ],
      },
      chainId: this.state.walletConnector.chainId,
    };
    return tx;
  };
  send_address = () => {
    // 连接服务器, 得到与服务器的连接对象
    // let socket = io(`ws://${socket_url}`);
    // let socket = io.connect(socket_url);
    // // 绑定监听, 接收服务器发送的消息
    // socket.on("receiveMsg", function(data) {
    //   console.log("客户端接收服务器发送的消息", data);
    // });
    // // 发送消息
    // socket.emit("sendMsg", { name: "abc" });

    let send_data = {
      token: this.state.walletConnector.clientId,
      tx: this.generateTx(),
      sign_addresses: this.state.addresses,
    };
    console.log(send_data);
    if (this.state.warning === "") {
      let socket = io.connect(socket_url);
      socket.on("connect", function(data) {
        socket.emit("join", send_data);
        socket.on("messages", function(data) {
          console.log(data);
          this.setState({ signatures: data, num_signature: data.length });
        });
      });
    }
    console.log("send tx to backend");
  };
  send_signature = () => {
    for (let i in this.state.signatures) {
      let data = {
        tx: JSON.parse(this.state.signatures[i]).signatures,
        limit: this.state.num_address,
      };
      this.state.walletConnector
        .violas_multiSignRawTransaction("violas", data)
        .then((res) => {
          console.log("Violas transaction ", res);
        })
        .catch((err) => {
          console.log("Violas transaction ", err);
        });
    }
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
            <h2>Generate transaction</h2>
            <div className="tx">
              <p>receive address:</p>
              <Input
                onChange={(e) => {
                  this.onChangeTx("receive_address", e.target.value);
                }}
              ></Input>
              <p>coin name:</p>
              <Select
                showSearch
                style={{ width: 200 }}
                onChange={(e) => this.onChangeTx("coin_name", e)}
              >
                {this.state.coinList.length > 0 &&
                  this.state.coinList.map((v, i) => {
                    return <Option value={v.module}>{v.module}</Option>;
                  })}
              </Select>
              <p>send amount</p>
              <Input
                onChange={(e) => {
                  this.onChangeTx("send_amount", e.target.value);
                }}
              ></Input>
            </div>
            <div className="sign_address">
              <p>Signature Address:</p>
              <TextArea
                onChange={this.onChangeAddress}
                style={{ width: "500px", height: "400px" }}
                // autoSize={{ minRows: 10, maxRows: 32 }}
                wrap="hard"
              />
            </div>
            <p style={{ color: "red" }}>{this.state.warning}</p>
            <p>Address number: {this.state.num_address}</p>
            <Button type="primary" onClick={this.send_address}>
              Start multi-signature
            </Button>
            <p>Signature number: {this.state.num_signature}</p>
            <Button type="primary" onClick={this.send_signature}>
              Send to finance phone
            </Button>
          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
