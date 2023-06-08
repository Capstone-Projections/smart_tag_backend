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
              background-color: #f0f0f0;
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
              cursor: pointer;
              user-select: all;
            }
      
            .attendance-info {
              margin-top: 30px;
              border-top: 1px solid #333;
              padding-top: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
      
            .nfc-sign {
              position: relative;
              width: 150px;
              height: 150px;
              background-color: #0e4b7d;
              border-radius: 50%;
              overflow: hidden;
            }
      
            .nfc-sign:before,
            .nfc-sign:after {
              content: "";
              position: absolute;
              width: 40px;
              height: 40px;
              background-color: #f2d40f;
              border-radius: 50%;
            }
      
            .nfc-sign:before {
              top: 35px;
              left: 55px;
            }
      
            .nfc-sign:after {
              top: 75px;
              left: 15px;
            }
      
            .nfc-sign .logo {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 80px;
              height: 80px;
              background-color: #000;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
      
            .nfc-sign .logo:before {
              content: "";
              position: absolute;
              width: 50px;
              height: 50px;
              background-color: #f2d40f;
              border-radius: 50%;
            }
      
            .nfc-sign .logo:after {
              content: "";
              position: absolute;
              width: 20px;
              height: 20px;
              background-color: #0e4b7d;
              border-radius: 50%;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Smart Tag</h1>
            <p>Your token is:</p>
            <p class="token" id="token" onclick="copyToken()">${token}</p>
            <div class="attendance-info">
              <div class="nfc-sign">
                <div class="logo"></div>
              </div>
            </div>
          </div>
        </body>
      </html>        `,
    };

    await sendgrid.send(msg);
}
async function debugSendEmailToken(email: string, token: string) {
    console.log(`email token for ${email}: ${token} `);
}
