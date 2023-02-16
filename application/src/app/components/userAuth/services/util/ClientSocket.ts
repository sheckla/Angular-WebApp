import { io, Socket } from 'socket.io-client';
import { Debug } from './Debug'
/*
* ClientSocket SocketIO Handler
* - establishes Connection with host
* - returns established Socket if correctly initialized (async)
*/
export class ClientSocket {
  private _socket!: Socket;
  private _host: string = "ws://localhost:3000";
  //private _host: string = "https://socketio-server.up.railway.app/";
  private _connected: boolean = false;

  // Async Connection Establish
  async establishConnection(): Promise<void> {
    // Keeps connection if already established
    if (this._connected) {
      Debug.log("Socket already connected to Host=" + this._host + ". Aborting establishConnection()");
      return;
    }

    return new Promise((success, failure) => {
      // Socket initialization
      this._socket = io(this._host, {
        transports: ["websocket"],
      });

      // Try to connect to Host
      this._socket.on("connect", () => {
        // Set connection to true - Client can check if still connected;
        this._connected = true;
        Debug.log("Connection successfull");
        success(); // notify callback
      });

      // Check for connect_error in SocketIO
      this._socket.on("connect_error", (error) => {
        this._connected = false;
        Debug.log("Error connecting to Host=" + this._host +
          ". Check Host configuration and try again");
        failure(); // notify callback
      });
    });
  }

  closeConnection(): boolean {
    if (this._connected) {
      this._socket.close();
      Debug.log("User logged out");
      return true;
    }

    return false;
  }

  socketInitialized(): boolean {
    return this._connected;
  }

  getSocket() {
    if (!this._connected) {
      Debug.log("Socket not initialized, please call establishConnection() first");
    }
    return this._socket!;
  }
}
