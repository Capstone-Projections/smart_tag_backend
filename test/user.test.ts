import { number } from '@hapi/joi';
import { createServer } from '../src/configs/server';
import Hapi from '@hapi/hapi';

describe('POST /user - create student', () => {
    let server: Hapi.Server;

    beforeAll(async () => {
        server = await createServer();
    });

    afterAll(async () => {
        await server.stop();
    });

    let userId;

    test('create student', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/user',
            payload: {
                firstName: 'test-first-name',
                lastName: 'test-last-name',
                email: `test-${Date.now()}@gmail.com`,
                role: 'STUDENT'
            },
        });

        expect(response.statusCode).toEqual(201);
        userId = JSON.parse(response.payload)?.iduser;
        expect(typeof userId === 'number').toBeTruthy();
    });

    test('create student validation', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/user',
            payload: {
                lastName: 'test-last-name',
                email: `test-${Date.now()}@prisma.io`,
            },
        });

        console.log(response.payload);
        expect(response.statusCode).toEqual(400);
    });
});
