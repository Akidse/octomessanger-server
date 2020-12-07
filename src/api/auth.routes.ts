import { Application } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import environment from "../environments";

export default (app: Application) => {
    app.post('/api/login', async function(req, res) {
        try {
            const {nickname, password} = req.body;
            if(!nickname || !password)
                return res.status(500).send({'err': 'WRONG_INPUT'});

            let user = await User.findOne({nickname: nickname, password: password});
            let isNew = false;
            if(!user) {
                let userWithNickname = await User.findOne({nickname: nickname});
                if(userWithNickname)
                    return res.status(500).send({'err': 'WRONG_PASSWORD'});

                user = await User.create({nickname: nickname, password: password});
                isNew = true;
            }

            const accessToken = jwt.sign({_id: user._id, nickname: user.nickname}, environment.ACCESS_TOKEN_SECRET, { expiresIn: '1w' });

            res.json({
                isNew,
                user: {
                _id: user.id,
                nickname: user.nickname,
                },
                accessToken
            });
        } catch (err) {
            return res.status(500).send({'err': 'LOGIN_ERROR'});
        }
    });
};