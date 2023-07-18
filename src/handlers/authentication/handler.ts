import { AuthenticateInput, APITokenPayload, LoginInput } from './interface';
import Hapi from '@hapi/hapi';
import { TokenType, UserRole } from '@prisma/client';
import Boom from '@hapi/boom';
import { add } from 'date-fns';
import jwt from 'jsonwebtoken';
import { apiTokenSchema } from './inputValidator';

// Load the JWT secret from environment variables or default
export const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_JWT_SECRET';

export const JWT_ALGORITHM = 'HS256';

export const AUTHENTICATION_TOKEN_EXPIRATION_HOURS = 12;

export const API_AUTH_STRATEGY = 'API';

export async function authenticateHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    // 👇 get prisma from shared application state
    const { prisma } = request.server.app;
    // 👇 get the email and emailToken from the request payload
    const { email, emailToken } = request.payload as AuthenticateInput;

    try {
        // Get short lived email token
        const fetchedEmailToken = await prisma.token.findUnique({
            where: {
                emailToken: emailToken,
            },
            include: {
                user: true,
            },
        });

        if (!fetchedEmailToken?.valid) {
            // If the token doesn't exist or is not valid, return 401 unauthorized
            return Boom.unauthorized();
        }

        if (fetchedEmailToken.expiration < new Date()) {
            // If the token has expired, return 401 unauthorized
            return Boom.unauthorized('Token expired');
        }

        // If token matches the user email passed in the payload, generate long lived API token
        if (fetchedEmailToken?.user?.email === email) {
            const tokenExpiration = add(new Date(), {
                hours: AUTHENTICATION_TOKEN_EXPIRATION_HOURS,
            });
            // Persist token in DB so it's stateful
            const createdToken = await prisma.token.create({
                data: {
                    type: TokenType.API,
                    expiration: tokenExpiration,
                    user: {
                        connect: {
                            email,
                        },
                    },
                },
            });

            // Invalidate the email token after it's been used
            await prisma.token.update({
                where: {
                    idtoken: fetchedEmailToken.idtoken,
                },
                data: {
                    valid: false,
                },
            });

            const authToken = generateAuthToken(createdToken.idtoken);
            return h.response().code(200).header('Authorization', authToken);
        } else {
            return Boom.unauthorized();
        }
    } catch (error) {
        //@ts-ignore
        return Boom.badImplementation('An error occured');
    }
}

// Generate a signed JWT token with the tokenId in the payload
function generateAuthToken(tokenId: number): string {
    const jwtPayload = { tokenId };

    return jwt.sign(jwtPayload, JWT_SECRET, {
        algorithm: JWT_ALGORITHM,
        noTimestamp: true,
    });
}

// Function will be called on every request using the auth strategy
export const validateAPIToken = async (
    decoded: APITokenPayload,
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) => {
    const { prisma } = request.server.app;
    const { tokenId } = decoded;
    // Validate the token payload adheres to the schema
    const { error } = apiTokenSchema.validate(decoded);

    if (error) {
        request.log(['error', 'auth'], `API token error: ${error.message}`);
        return { isValid: false };
    }

    try {
        // Fetch the token from DB to verify it's valid
        const fetchedToken = await prisma.token.findUnique({
            where: {
                idtoken: tokenId,
            },
            include: {
                user: true,
            },
        });

        // Check if token could be found in database and is valid
        if (!fetchedToken || !fetchedToken?.valid) {
            return { isValid: false, errorMessage: 'Invalid Token' };
        }

        // Check token expiration
        if (fetchedToken.expiration < new Date()) {
            return { isValid: false, errorMessage: 'Token expired' };
        }

        // Get all the courses that the user is the teacher of
        const teacherOf = await prisma.course.findMany({
            where: {
                user_has_course: {
                    some: {
                        user: {
                            iduser: fetchedToken.iduser,
                            role: UserRole.LECTURER,
                        },
                    },
                },
            },
            select: {
                idcourse: true,
            },
        });

        // The token is valid. Make the `userId`, `isAdmin`, and `teacherOf` to `credentials` which is available in route handlers via `request.auth.credentials`
        return {
            isValid: true,
            credentials: {
                tokenId: decoded.tokenId,
                userId: fetchedToken.iduser,
                isAdmin: fetchedToken.user.isAdmin,
                // convert teacherOf from an array of objects to an array of numbers
                teacherOf: teacherOf.map(({ idcourse }) => idcourse),
            },
        };
    } catch (error) {
        //@ts-ignore
        request.log(['error', 'auth', 'db'], error);
        return { isValid: false };
    }
};
