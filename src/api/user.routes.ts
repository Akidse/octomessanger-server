import { Application } from "express";
import User from "../models/user";
import authenticateJWTMiddleware from "./middleware/authenticateJWT.middleware";

export default (app: Application) => {
    app.get('/api/user', authenticateJWTMiddleware, function(req, res) {
        res.json({
            _id: (req as any).user._id,
            nickname: (req as any).user.nickname,
        });
    });

    app.get('/api/users', authenticateJWTMiddleware, async function(req, res) {
        let users = await User.find({});

        return res.json(users);
    });

    app.post('/api/users/search', authenticateJWTMiddleware, async function(req, res) {
        let users = await User.find({nickname: {'$regex': req.body.searchText}, _id: {$not: {$eq: (req as any).user._id}}});
        return res.json({foundUsers: users});
    });
}