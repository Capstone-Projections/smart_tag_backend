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
    const backgroundColor = '#ffecb3'; // Light shade of yellow

    const msg = {
        to: email,
        from: 'capstoneprojections@gmail.com',
        subject: 'Login token for Smart Tag Account',
        text: `The login token for the API is: ${token}`,
        html: `
            <html>
                <head>
                    <style>
                        .container {
                            background-color: ${backgroundColor};
                            padding: 20px;
                            border-radius: 5px;
                            color: #333;
                            font-family: Arial, sans-serif;
                            max-width: 600px;
                            margin: 0 auto;
                        }

                        h1 {
                            font-size: 24px;
                            margin-bottom: 20px;
                        }

                        p {
                            font-size: 16px;
                            margin-bottom: 10px;
                        }

                        .token {
                            font-weight: bold;
                            font-size: 20px;
                        }

                        .attendance-info {
                            margin-top: 30px;
                            border-top: 1px solid #333;
                            padding-top: 20px;
                        }

                        .info-title {
                            font-size: 18px;
                            font-weight: bold;
                            margin-bottom: 10px;
                        }

                        .info-description {
                            font-size: 16px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Login token for Smart Tag Account</h1>
                        <p>Your token is:</p>
                        <p class="token">${token}</p>
                        <div class="attendance-info">
                            <h2 class="info-title">Smart Tag</h2>
                            <p class="info-description">Thank you for using our attendance-taking application. With this token, you can securely access the system and manage attendance records.</p>
                            <p class="info-description">Please keep this token confidential and do not share it with others.</p>
                        </div>
                    </div>
                </body>
            </html>
        `,
    };

    await sendgrid.send(msg);
}

async function debugSendEmailToken(email: string, token: string) {
    console.log(`email token for ${email}: ${token} `);
}
