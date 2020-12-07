import path from "path";
import fs from "fs";

export default (socket: SocketIO.Socket) => {
    const listenersPath = path.resolve(__dirname);

    fs.readdir(listenersPath, (err, files) => {
        if(err) {
            process.exit(1);
        }

        files.map(filename => {
            if(filename === "index.js" || filename === "index.ts")
                return;
            
            console.debug("Initializing listener at: %s", filename);
            const listener = require(path.resolve(__dirname, filename)).default;
            
            listener(socket);
        });
    });
};