import Hapi from '@hapi/hapi';
import { createStudentHandler } from '../handlers/student/handler';
import { studentInputValidator } from '../handlers/student/inputValidator';

// plugin to instantiate Prisma Client
const studentPlugin = {
    name: 'app/students',
    dependencies: ['prisma'],
    register: async function (server: Hapi.Server) {
        // here you can use server.app.prisma
        server.route([
            {
                method: 'POST',
                path: '/students',
                handler: createStudentHandler,
                options: {
                    validate: {
                        payload: studentInputValidator,
                    },
                },
            },
        ]);
    },
};
export default studentPlugin;
