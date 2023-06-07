import Hapi from '@hapi/hapi';
import Joi from 'joi';
import Boom from '@hapi/boom';
import sendgrid from '@sendgrid/mail';

// Module augmentation to add shared application state
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33809#issuecomment-472103564
declare module '@hapi/hapi' {
    interface ServerApplicationState {
        sendEmailToken(email: string, token: string): Promise<void>;
    }
}

const emailPlugin = {
    name: 'app/email',
    register: async function (server: Hapi.Server) {
        if (!process.env.SENDGRID_API_KEY) {
            console.log(
                `The SENDGRID_API_KEY env var must be set, otherwise the API won't be able to send emails.`,
                `Using debug mode which logs the email tokens instead.`
            );
            server.app.sendEmailToken = debugSendEmailToken;
        } else {
            sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
            // sendgrid.setApiKey("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");
            server.log(`hey server	`);
            server.app.sendEmailToken = sendEmailToken;
        }
    },
};

export default emailPlugin;

async function sendEmailToken(email: string, token: string) {
    const msg = {
        to: email,
        from: 'capstoneprojections@gmail.com',
        subject: 'Login token for Smart Tag Account',
        text: `The login token for the API is: ${token}`,
    };

    await sendgrid.send(msg);
}

async function debugSendEmailToken(email: string, token: string) {
    console.log(`email token for ${email}: ${token} `);
}
