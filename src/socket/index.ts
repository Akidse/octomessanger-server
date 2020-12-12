import environment from "../environments";
import User from "../models/user";
import connectedEvent from "./events/connected.event";
import initSocketListeners from "./listeners";
import socketJWTMiddleware from "./middleware/socketJWT.middleware";

//arhitecture idea from:
//https://aleemisiaka.com/blog/socketio-app-structure/

export interface IExtendedSocket extends SocketIO.Socket {
    user: any
};

let sockets: {socket: SocketIO.Socket, userId: string}[] = [];

export const addSocket = (obj: {socket: SocketIO.Socket, userId: string}) => {
    sockets.push(obj);
}

export const removeSocketByUserId = (userId: string) => {
    sockets = sockets.filter((u) => u.userId != userId);
}

export const getSockets = () => {
    return sockets;
}

export default (server: any) => {
    const io: SocketIO.Server = require('socket.io')(server, {
        cors: {
            origin: environment.SOCKET_IO_CORS_ORIGIN,
            methods: ["GET", "POST"]
        }
    });

    io.use(socketJWTMiddleware);

    io.on('connection', (socket: IExtendedSocket) => {
        addSocket({socket: socket, userId: socket.user._id});

        initSocketListeners(socket);

        connectedEvent({socket: socket});
    });
    
    return io;
};