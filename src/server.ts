import express from 'express';
import { Request, Response } from 'express';
import cors from "cors";
import * as dotenv from 'dotenv';

//models
import { CustomError } from './models/custorm-error';
import { EnvStyle } from './models/enums/env-style.enum';

//services
import { AppService } from './services/appservice.service';

//swagger
// import getJSONSwagger from '../swagger'

//routes
import { authRouter } from './api/auth.router';
import { userRoutes } from './api/users.router';
import { messagesRouter } from './api/message.router';

dotenv.config();

const app = express();

const arg = process.argv[process.argv.length - 1];

//cors
// const allowedOrigin = arg === EnvStyle.dev ? process.env.CLIENT_HOST: process.env.PROD_CLIENT_HOST;
const corsOptions: cors.CorsOptions = {
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", 'x_client_type', 'x_client_name', 'x_client_version', 'authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};
console.log('CORS OPTIONS on INIT: ', corsOptions);
app.use('*', cors(corsOptions));

app.use(express.json());

let environment = EnvStyle.dev;
let port = 0;
let host = '';
let appName = ''

if(arg === EnvStyle.dev) {
    port = parseInt(process.env.PORT);
    host = process.env.HOST;
    appName = process.env.APP_NAME;
}
if(arg === EnvStyle.prod) {
    environment = EnvStyle.prod;
    port = parseInt(process.env.PROD_PORT);
    host = process.env.PROD_HOST;
    appName = process.env.PROD_APP_NAME;
}
console.log('EnvType before server init arg: ', arg, ', environment: ', environment, `, host:${host}` + ', appName: ' + appName);

let initResult: string | CustomError;
const appService = new AppService();

appService.init(environment).then((result: CustomError | boolean) => {
    if(result instanceof CustomError) {
        initResult = result;
    }
    else {
        try {
            authRouter(app, appService.getService('AuthService'));
            userRoutes(app, appService.getService('UsersService'), appService.getService('AuthService'), appService.getService('FileService'));
            messagesRouter(app, appService.getService('AuthService'), appService.getService('MessageService'));
            initResult = "Server initialization successful!";
        }
        catch(error: any) {
            initResult = new CustomError(error.name, error.message, 'Server::AppService()');
            return initResult;
        }
    }
});

app.get('/', async(req: Request, res: Response) => {
    if(initResult instanceof CustomError) {
        res.status(500).send(initResult);
    }
    else {
        res.status(200).send(initResult);
    }
})

let listenHost = 'localhost';
app.listen(port,() => {
    // getJSONSwagger(app, host, port);
    console.log(`App is running on http://${listenHost}:${port}`);
})
module.exports = app;