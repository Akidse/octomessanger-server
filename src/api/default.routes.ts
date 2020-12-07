import { Application } from "express";

export default (app: Application) => {
    app.use(function(req, res, next) {
        res.status(404).send('Page not found');
    });
}