import jwt from "jsonwebtoken";
import environment from "../../environments";

export default (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.sendStatus(401);

    const token = authHeader.split(' ')[1];

    jwt.verify(token, environment.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
        if (err)
            return res.sendStatus(403);

        req.user = user;
        next();
    });
};