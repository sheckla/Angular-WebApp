/****************************
 Starting the Client
 ****************************
* 1. install NodeJS https://nodejs.org/en/download/
* 2. start terminal
* 3. type 'npm install'
* 4. node client.js
* 5. See Socket-Connection from Server at https://socketio-server.up.railway.app/
*/
var userName = "Applejack";
var messageToServer = "OwO v2";


/****************************
 Client Socket Initialization
 ****************************/
const io = require("socket.io-client");
var host = "https://socketio-server.up.railway.app/";
host = "ws://localhost:3000";
var socket;

export function establishSocketConnection() {
  socket = io(host,{
    transports: ['websocket']
  });
}

export function initOnConnectListeners() {
    socket.on("connect", () => {
        console.log("connection established, sockedID=" + socket.id);

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
          console.log("Local client disconnect" + arg);
        });

      });

    /****************************
     Socket Connection Failed
    ****************************/
    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
}

export function closeSocketConnection() {
    socket.emit("Client_ConnectionCloseRequest");
}
