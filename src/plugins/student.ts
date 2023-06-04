import Hapi from '@hapi/hapi'
import { server } from '../configs/server'
import { createStudentHandler } from '../handlers/student/student.handler'
// plugin to instantiate Prisma Client
const studentPlugin = {
  name: 'app/student',
  dependencies: ['prisma'],
  register: async function(server: Hapi.Server) {
    // here you can use server.app.prisma
    server.route([
      {
        method: 'POST',
        path: '/users',
        handler: createStudentHandler,
      },
    ])
  },
}
export default studentPlugin
