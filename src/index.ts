import environment from "./environments";
import initExpress from "./api";
import initSocketio from "./socket";
import chalk from "chalk";
import mongoose from 'mongoose';

const connectDatabase = (onDatabaseStartCallback: () => void) => {
  const mongooseOpts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  };

  mongoose.connect(environment.MONGO_DB_LINK, mongooseOpts).then;

  mongoose.connection.on('error', (e) => {
      console.log(e);
      if (e.message.code === 'ETIMEDOUT')
        mongoose.connect(environment.MONGO_DB_LINK, mongooseOpts);
  });

  mongoose.connection.once('open', () => {
      console.log(chalk.blue(`
            ######################
            MongoDB successfully connected to ${environment.MONGO_DB_LINK}
            ######################
      `));

      onDatabaseStartCallback();
  });
};

const startServer = () => {
    connectDatabase(() => {
        const expressApp = initExpress();
        const server = require('http').createServer(expressApp);
        const io = initSocketio(server);

        server.listen(environment.SERVER_PORT, () => {
            console.log(chalk.yellow(`
            ######################
            Listening on port ${environment.SERVER_PORT}
            ######################
            `));
        });
    });
};

startServer();