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
import { NextFunction } from 'connect';

dotenv.config();

const app = express();
app.use(express.json());

// const corsOptions: cors.CorsOptions = {
//     origin: [process.env.CLIENT_HOST, process.env.PROD_CLIENT_HOST],
//     methods: ['GET', 'POST', 'DELETE', 'PUT'],
//     allowedHeaders: ['x-client-type', 'x-client-name', 'x-client-name', 'authorization'],
//     credentials: true,
//     optionsSuccessStatus: 200
// };

const arg = process.argv[process.argv.length - 1];

let environment = EnvStyle.dev;
let port = 0;
let host = '';
let appName = ''

//cors
app.options('*', cors());
// app.options('*', 'Access-Control-Allow-Origin');
// app.options('*', 'Access-Control-Allow-Headers');

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', arg === EnvStyle.dev ? process.env.CLIENT_HOST: process.env.PROD_CLIENT_HOST);
    res.header('Access-Control-Allow-Headers',['x_client_type', 'x_client_name', 'x_client_version', 'authorization', 'content-type']);
    // res.header('Accept', 'application/json;charset=utf-8');
    res.header('Access-Control-Allow-Methods', ['GET', 'POST', 'DELETE', 'PUT']);
    next();
});

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