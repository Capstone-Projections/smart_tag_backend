import Hapi from '@hapi/hapi'
import { server } from '../../configs/server'
import { StudentInput } from './student.props'


export async function createStudentHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { prisma } = request.server.app
    const payload = request.payload as StudentInput
  
    try {
      const createdStudent = await prisma.student.create({
        data: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
        },
        select: {
          idstudent: true,
        },
      })
      return h.response(createdStudent).code(201)
    } catch (err) {
      console.log(err)
    }
  }