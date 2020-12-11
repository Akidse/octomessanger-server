import { IEnvironment } from "./env"

const environment: IEnvironment = {
    MONGO_DB_LINK: process.env.MONGO_DB_LINK || '',
    SERVER_PORT: process.env.SERVER_PORT || process.env.PORT || '' ,
    SOCKET_IO_CORS_ORIGIN: process.env.SOCKET_IO_CORS_ORIGIN || '',
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || '',
};

export default environment;