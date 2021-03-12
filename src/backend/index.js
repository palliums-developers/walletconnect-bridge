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
let io = require("socket.io")(server, { cors: true });
// let bodyParser = require("body-parser");
// let path = require("path");
// let urlencodedParser = bodyParser.urlencoded({ extended: false });
// const httpServer = require("http").createServer(app);
// const io = require("socket.io")(httpServer);
let port = 3372;

// app.get("/", function(req, res) {
//   res.send("Hello World");
// });

// app.post("/tx", urlencodedParser, function(req, res) {
//   let response = {
//     token: req.body.token,
//     address: req.body.address,
//     tx: req.body.tx,
//     signed_address: req.body.signed_address,
//   };
// });

// app.post("/signed_tx", urlencodedParser, function(req, res) {
//   let response = {
//     token: req.body.token,
//     address: req.body.address,
//     signed_tx: req.body.signed_tx,
//   };
// });

// let wc2finance = () => {
//   let result = {
//     token: "",
//     address: "",
//     signed_txs: [
//       {
//         address: "",
//         signed_tx: "",
//       },
//     ],
//   };
// };

// let server = app.listen(8081, function() {
//   let host = server.address().address;
//   let port = server.address().port;
//   console.log(`Running at http://%s:%s`, host, port);
// });

// app.use(express.static(__dirname + "/bower_components"));
// app.get("/", function(req, res, next) {
//   res.sendFile(__dirname + "/index.html");
// });

io.on("connection", function(client) {
  console.log("Client connected...");
  client.on("join", function(data) {
    console.log(data);
    client.emit("messages", "Hello from server");
  });
  // client.on("getTx", function(data) {
  //   console.log(data);
  //   if (data > 10) {
  //     client.emit("getSignature", `finished ${data}`);
  //   }
  // });
});

server.listen(port);

// let ws = server.listen(port, function() {
//   console.log("start at port:" + ws.address().port);
// });

// httpServer.listen(port);
