/****************************
 Starting the Client
 ****************************
* 1. install NodeJS https://nodejs.org/en/download/
* 2. start terminal
* 3. type 'npm install'
* 4. node client.js
* 5. See Socket-Connection from Server at https://socketio-server.up.railway.app/
*/

/****************************
 Client Socket Initialization
 ****************************/
/*
const io = require("socket.io-client");
var host = "https://socketio-server.up.railway.app/";
host = "ws://localhost:3000";
var socket;
var connected = false;

export function establishSocketConnection() {
  console.log("Establish socket connection.");
  socket = io(host, {
    transports: ["websocket"],
  });
  connected = true;
}

export function isConnected() {
  if (!connected) console.log("Socket not connected - abort");
  return connected;
}

export function initOnConnectListeners() {
  if (!isConnected()) return;
  socket.on("connect", () => {
    console.log("Connection: Established, SockedID = " + socket.id);
    // Set connection to true - Client can check if still connected;
    this.connected = true;

    // Receive Listener:  Server Local Time
    socket.on("Server_SendLocalTime", (arg) => {
      console.log(arg);
    });

    socket.on("Client_StringRequest_Answer", (msg) => {
      console.log(msg);
      socket.emit("Client_ConnectionCloseRequest"); // Request Disconnect
    });

    // Receive Listener:  Disconnect
    socket.on("disconnect", (arg) => {
      console.log("Local client disconnects" + arg);
    });
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
}

export function closeSocketConnection() {
  if (!isConnected()) return;
  socket.emit("Client_ConnectionCloseRequest");
}

export function login(username) {
  if (!isConnected()) return;
  console.log("Username: " + username + " send to server.");
  socket.emit("Client_SendUsername", username);
  socket.on("Client_SendUsername_Status", (arg) => {
    if (arg) {
      console.log("Status: Login accepted");
    } else {
      console.error("Status: Login rejeted, User already logged in.");
    }
    return arg
  });
}
*/
