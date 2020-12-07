import jwt from "jsonwebtoken";
import environment from "../../environments";

export default (socket: any, next: any) => {
    if(!socket.handshake.query || !socket.handshake.query.token)
        return next(new Error('Authentication error'));

    jwt.verify(socket.handshake.query.token, environment.ACCESS_TOKEN_SECRET, function(err: any, decoded: any) {
        if (err) return next(new Error('Authentication error'));
        socket.user = decoded;
        next();
    });
}