import express from 'express';
import { Request, Response } from 'express';
// import { Server } from 'http';
// import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
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
import { UsersService } from './services/users.service';
// import { routerEntityRouter } from './routes/route-entity.router';
// import { taskRouter } from './routes/tasks.router';

dotenv.config();

const app = express();
const arg = process.argv[process.argv.length - 1];

let environment = EnvStyle.dev;
let port = 0;
let host = '';
let appName = ''

if(arg === EnvStyle.dev) {
    port = parseInt(process.env.PORT);
    console.log('PORT: ', port);
    host = process.env.HOST;
    appName = process.env.APP_NAME;
}
if(arg === EnvStyle.prod) {
    environment = EnvStyle.prod;
    port = parseInt(process.env.PROD_PORT);
    // console.log('PORT: ', port);
    // host = process.env.PROD_HOST;
    appName = process.env.PROD_APP_NAME;
}
console.log('EnvType before server init arg: ', arg, ', environment: ', environment, `, host:${host}` + ', appName: ' + appName);

//socketio
// const server = new Server(app);
// const socketIOServer = new SocketIOServer(server, { cors: { origin: host } });

//json encoded bodies in requests
// const corsOptions: cors.CorsOptions = {
//     origin: [host],
// }
// app.use(cors(corsOptions));
app.use(express.json());

//init sevices
let initResult: string | CustomError;

const appService = new AppService();
console.log('appService intance created...');

appService.init(environment).then((result: CustomError | boolean) => {
    if(result instanceof CustomError) {
        console.log('VISSZADOBOTT sa INITnél: ', result);
        initResult = result;
    }
    else {
        // momentTimeDiff('October 12th 2022, 14:00:00 pm', 'October 15th 2022, 8:00:00 am');
        //timeDiffTest:
        // let startDate = moment.tz(TimezonesEUR.BUDAPEST);
        // let newDate = moment('2022-11-09 15:59:59');
        // if(newDate > startDate) {
        //     console.log(`newDate (${newDate}) is bigger than startDate (${startDate})!`)
        // }
        // else {
        //     console.log(`startDate (${startDate}) is bigger than newDate (${newDate})!`) 
        // }
        try {
            authRouter(app, appService.getService('AuthService'));
            userRoutes(app, appService.getService('UsersService'), appService.getService('AuthService'), appService.getService('FileService'));
            // routerEntityRouter(app, appService.getService('RouteEntityService'), appService.getService('AuthService'));
            // taskRouter(app, appService.getService('TasksService'),appService.getService('RouteEntityService'), appService.getService('AuthService'));
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

// socketIOServer.on('connection', (socket) => {
//     console.log('User is connected!')
//     socket.on('disconnect', () => {
//         console.log('USer disconnected!')
//     })
// });

let listenHost = 'localhost';
// environment === EnvStyle.dev? listenHost = 'localhost': listenHost = process.env.PROD_HOST;
app.listen(port,() => {
    // getJSONSwagger(app, host, port);
    console.log(`App is running on http://${listenHost}:${port}`);
})
module.exports = app;