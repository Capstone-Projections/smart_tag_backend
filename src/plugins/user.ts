
import { createUserHandler } from "../handlers/user/handler";
import { userInputValidator } from "../handlers/user/inputValidator";
import Hapi from '@hapi/hapi'
// plugin to instantiate Prisma Client
const userPlugin = {
    name: 'app/user',
    dependencies: ['prisma'],
    register: async function (server: Hapi.Server) {
        // here you can use server.app.prisma
        server.route([
            {
                method: 'POST',
                path: '/user',
                handler: createUserHandler,
                options: {
                    validate: {
                        payload: userInputValidator,
                    },
                },
            },
        ]);
    },
};
export default userPlugin;
