import { LoginInput } from './interface';
import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { TokenType, UserRole } from '@prisma/client';
import { add } from 'date-fns';

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;

export async function loginHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    // 👇 get prisma and the sendEmailToken from shared application state
    const { prisma, sendEmailToken } = request.server.app;
    // 👇 get the email from the request payload
    const { email } = request.payload as LoginInput;
    // 👇 generate an alphanumeric token
    const emailToken = generateEmailToken();
    // 👇 create a date object for the email token expiration
    const tokenExpiration = add(new Date(), {
        minutes: EMAIL_TOKEN_EXPIRATION_MINUTES,
    });

    try {
        // 👇 create a short lived token and update user or create if they don't exist

        const createdToken = await prisma.token.create({
            data: {
                emailToken,
                type: TokenType.EMAIL,
                expiration: tokenExpiration,
                user: {
                    connect: {
                        email,
                    },
                },
            },
            select: {
                iduser: true,
            },
        });

        // 👇 send the email token
        await sendEmailToken(email, emailToken);
        return h.response({ userid: createdToken.iduser }).code(200);
    } catch (error: any) {
        // 👇 if the error is a Prisma error, it means the user already exists

        return Boom.badImplementation(error.message);
    }
}

export async function signupHandler(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
) {
    // 👇 get prisma and the sendEmailToken from shared application state
    const { prisma, sendEmailToken } = request.server.app;
    // 👇 get the email from the request payload
    const { email } = request.payload as LoginInput;
    // 👇 generate an alphanumeric token
    const emailToken = generateEmailToken();
    // 👇 create a date object for the email token expiration
    const tokenExpiration = add(new Date(), {
        minutes: EMAIL_TOKEN_EXPIRATION_MINUTES,
    });

    try {
        // 👇 Check if the user with the provided email already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            // User already exists, return an error
            return Boom.badRequest('User already exists.');
        }

        // 👇 User doesn't exist, create a short-lived token and create the user
        const createdToken = await prisma.token.create({
            data: {
                emailToken,
                type: TokenType.EMAIL,
                expiration: tokenExpiration,
                user: {
                    create: {
                        email,
                    },
                },
            },
            select: {
                iduser: true,
            },
        });

        // 👇 send the email token
        await sendEmailToken(email, emailToken);
        return h.response({ userid: createdToken.iduser }).code(200);
    } catch (error: any) {
        return Boom.badImplementation('Sign Up Failed');
    }
}

// Generate a random 8 digit number as the email token
function generateEmailToken(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
