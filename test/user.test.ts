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

    let userId:number;

    test('create student', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
                firstName: 'test-first-name',
                lastName: 'test-last-name',
                email: `test-${Date.now()}@gmail.com`,
                role: 'STUDENT',
            },
        });

        expect(response.statusCode).toEqual(201);
        userId = JSON.parse(response.payload)?.iduser;
        expect(typeof userId === 'number').toBeTruthy();
    });

    test('create student validation', async () => {
        const response = await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
                lastName: 'test-last-name',
                email: `test-${Date.now()}@prisma.io`,
            },
        });

        console.log(response.payload);
        expect(response.statusCode).toEqual(400);
    });

    test('get user returns 404 for non existant user', async () => {
        const response = await server.inject({
          method: 'GET',
          url: '/users/9999',
        })
      
        expect(response.statusCode).toEqual(404)
      })

      test('get user returns user', async () => {
        const response = await server.inject({
          method: 'GET',
          url: `/users/${userId}`,
        })
        expect(response.statusCode).toEqual(200)
        const user = JSON.parse(response.payload)
      
        expect(user.iduser).toBe(userId)
      })
});
