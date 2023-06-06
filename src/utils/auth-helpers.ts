import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';

// Pre function to check if user is the teacher of a course and can modify it
export async function isAdmin(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const { isAdmin } = request.auth.credentials;

    if (isAdmin) {
        // If the user is an admin allow
        return h.continue;
    }

    // If the user is not a teacher of the course, deny access
    throw Boom.forbidden();
}
