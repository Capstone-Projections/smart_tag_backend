import { number } from '@hapi/joi'
import { createServer } from '../src/configs/server'
import Hapi from '@hapi/hapi'

describe('POST /students - create student', () => {
  let server: Hapi.Server

  beforeAll(async () => {
    server = await createServer()
  })

  afterAll(async () => {
    await server.stop()
  })

  let studentId

  test('create student', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/students',
      payload: {
        firstName: 'test-first-name',
        lastName: 'test-last-name',
        email: `test-${Date.now()}@gmail.com`,
      }
    })

    expect(response.statusCode).toEqual(201)
    studentId = JSON.parse(response.payload)?.idstudent
    expect(typeof studentId === 'number').toBeTruthy()
  })

})