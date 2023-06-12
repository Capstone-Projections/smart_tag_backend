import Hapi from '@hapi/hapi';

const plugin: Hapi.Plugin<undefined> = {
    name: 'app/status',
    register: async function (server: Hapi.Server) {
        server.route({
            method: 'GET',
            path: '/',
            handler: (_, h: Hapi.ResponseToolkit) => {
                const html = `
          <html>
            <head>
              <title>Status Page</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f5f5;
                  padding: 20px;
                  text-align: center;
                }
                h1 {
                  color: #333;
                }
              </style>
            </head>
            <body>
              <h1>Server is up and running!</h1>
            </body>
          </html>
        `;
                return h.response(html).type('text/html');
            },
            options: {
                // has to be false for health checks to work
                auth: false,
            },
        });
    },
};

export default plugin;
