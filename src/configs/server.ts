import Hapi from '@hapi/hapi';
import status from '../plugins/status';
import prismaPlugin from '../plugins/prisma';
import userPlugin from '../plugins/users';
import emailPlugin from '../plugins/email';
import authPlugin from '../plugins/auth';
import hapiAuthJwt2 from 'hapi-auth-jwt2';
import coursesPlugin from '../plugins/courses';
import lessonsPlugin from '../plugins/lessons';
import attedancePlugin from '../plugins/attendance';
import lectureroomPlugin from '../plugins/lectureroom';

export const server: Hapi.Server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
        cors: {
            origin: ['http://localhost:3000', 'https://smart-tag.onrender.com'],
        },
    },
});

export async function createServer(): Promise<Hapi.Server> {
    //allow for cors in this server
    await server.register([
        status,
        prismaPlugin,
        userPlugin,
        emailPlugin,
        hapiAuthJwt2,
        authPlugin,
        coursesPlugin,
        lessonsPlugin,
        attedancePlugin,
        lectureroomPlugin,
    ]);
    await server.initialize();
    return server;
}

export async function startServer(server: Hapi.Server): Promise<Hapi.Server> {
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
    return server;
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
