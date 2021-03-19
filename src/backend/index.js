let config = require("../config");
let express = require("express");
let app = express();
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

let server = require("http").createServer(app);
let io = require("socket.io")(server, {
  cors: true,
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
});
let bodyParser = require("body-parser");
// let path = require("path");
let urlencodedParser = bodyParser.urlencoded({ extended: false });
// const httpServer = require("http").createServer(app);
// const io = require("socket.io")(httpServer);
const redis = require("redis");
const client = redis.createClient(
  config.redis_config.port,
  config.redis_config.url
);
client.auth(config.redis_config.password);
const axios = require("axios");
let port = 3372;

app.get("/", function(req, res) {
  res.send("Hello Multi-signature");
});

// app.post("/tx", urlencodedParser, function(req, res) {
//   let response = {
//     token: req.body.token,
//     address: req.body.address,
//     tx: req.body.tx,
//     signed_address: req.body.signed_address,
//   };
// });

app.post("/signed_tx", urlencodedParser, function(req, res) {
  let response = {
    token: req.body.token,
    address: req.body.address,
    signed_tx: req.body.signed_tx,
  };
  console.log(response);
  let saved_signature = client.lrange(
    response.token + "_signature",
    0,
    -1,
    function(err, data) {
      if (err) {
        console.log(err);
      } else {
        for (let i in data) {
          if (response.address === JSON.parse(data[i]).singer) {
            res.send("report posting");
            return;
          }
        }
        saveSign2redis(response);
        res.send("succeed");
      }
      client.end;
    }
  );
});

// let server = app.listen(8081, function() {
//   let host = server.address().address;
//   let port = server.address().port;
//   console.log(`Running at http://%s:%s`, host, port);
// });

// app.use(express.static(__dirname + "/bower_components"));
// app.get("/", function(req, res, next) {
//   res.sendFile(__dirname + "/index.html");
// });

io.on("connection", function(_client) {
  console.log("Client connected...");
  _client.on("join", function(data) {
    console.log(data.token);
    save2redis(data);
    let intervalMonitor = setInterval(function() {
      let load_signature = client.lrange(
        data.token + "_signature",
        0,
        -1,
        function(err, _data) {
          if (err) {
            console.log(err);
          } else {
            // console.log(_data.length)
            if (_data.length === data.sign_addresses.length) {
              console.log("get all signature ", _data);
              _client.emit("messages", _data);
              clearInterval(intervalMonitor);
            }
          }
          client.end;
        }
      );
      setTimeout(() => clearInterval(intervalMonitor), 10 * 60 * 1000);
    }, 1000);
  });
  setTimeout(() => _client.disconnect(true), 10 * 60 * 1000);
  _client.on("disconnect", function() {
    console.log("user disconnected");
    // client.del(data && data.token + "_tx");
    // client.del(data && data.token + "_signer");
    // client.del(data && data.token + "_signature");
    _client.emit("messages", "Timeout");
  });
});

let save2redis = (data) => {
  client.del(data.token + "_tx", function(err, data) {
    if (err) {
      console.log(`client err del token_tx ${err}`);
    }
    // else {
    //   console.log(`client operation del token_tx ${data}`);
    // }
    client.end;
  });
  client.del(data.token + "_signer", function(err, data) {
    if (err) {
      console.log(`client err del token_sign_address ${err}`);
    }
    // else {
    //   console.log(`client operation del token_sign_address ${data}`);
    // }
    client.end;
  });
  let filter_sign_addresses = filter_address(data.sign_addresses);
  client.set(data.token + "_tx", JSON.stringify(data.tx), function(err, data) {
    if (err) {
      console.log(`client err set token_tx ${err}`);
    }
    // else {
    //   console.log(`client operation set token_tx ${data}`);
    // }
    client.end;
  });
  client.lpush(data.token + "_signer", ...filter_sign_addresses, function(
    err,
    data
  ) {
    if (err) {
      console.log(`client err lpush token_signer ${err}`);
    }
    // else {
    //   console.log(`client operation lpush token_signer ${data}`);
    // }
    client.end;
  });
  pushTx2signer(data.tx, data.sign_addresses, data.token);
};

let saveSign2redis = (data) => {
  client.lpush(
    data.token + "_signature",
    JSON.stringify({ singer: data.address, signature: data.signed_tx }),
    function(err, data) {
      if (err) {
        console.log(`client err lpush token_signature ${err}`);
      }
      // else {
      //   console.log(`client operation lpush token_signature ${data}`);
      // }
      client.end;
    }
  );
};

let filter_address = (sign_addresses) => {
  return Array.from(new Set(sign_addresses));
};

let pushTx2signer = (tx, sign_addresses, token) => {
  axios
    .post("https://api4.violas.io/1.0/violas/message/broadcast", {
      sender: tx.from,
      addresses: sign_addresses,
      sign_data: tx,
      token: token,
    })
    .then((res) => console.log(res.data));
};

server.listen(port);

// let ws = server.listen(port, function() {
//   console.log("start at port:" + ws.address().port);
// });

// httpServer.listen(port);
