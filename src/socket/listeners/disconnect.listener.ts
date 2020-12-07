import { IExtendedSocket, removeSocketByUserId } from "..";

export default (socket: IExtendedSocket) => {
    socket.on('disconnect', () => {
        removeSocketByUserId(socket.user._id);
    });
}