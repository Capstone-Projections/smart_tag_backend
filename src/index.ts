import { createServer, startServer } from './utils/server';

createServer()
    .then(startServer)
    .catch((err) => {
        console.log(err);
    });
