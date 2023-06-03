import { createServer, startServer } from './configs/server';

createServer()
    .then(startServer)
    .catch((err) => {
        console.log(err);
    });
