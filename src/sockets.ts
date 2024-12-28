import { Server } from 'socket.io';
import User from './models/User';
import { error, warning } from './utils/text-coloring';

enum SocketEvent {
  ping = 'ping',
  pong = 'pong',
}

class SocketConnection {
  private io: Server;
  private users: User[] = [];

  constructor(io: Server) {
    this.io = io;
  }

  connect() {
    this.io.on('connection', connection => {
      this.users.push(new User(connection));
      console.log(warning`A user is ONLINE: ` + connection.id);

      connection.on(SocketEvent.ping, date => {
        connection.emit(SocketEvent.pong, date);
      });

      connection.on('disconnect', () => {
        console.log(error`A user is OFFLINE: ` + connection.id);
      });
    });

    this.io.on('connect_error', err => {
      console.error(`connect_error due to ${err.message}`);
    });
  }
}

function socketConnection(io: Server) {
  new SocketConnection(io).connect();
}

export default socketConnection;
