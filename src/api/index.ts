import { Application } from "express";
import express from 'express';
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from 'cors';
import morgan from "morgan";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import defaultRoutes from "./default.routes";

export default (): Application => {
    const app: Application = express();
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(cors());
    app.use(morgan('combined'));

    authRoutes(app);
    userRoutes(app);
    defaultRoutes(app);
    return app;
}