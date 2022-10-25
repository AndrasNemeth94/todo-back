import { initializeApp, cert, ServiceAccount, App } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { Bucket, Storage } from '@google-cloud/storage';
import * as dotenv from 'dotenv';
dotenv.config();

//models
import { CustomError } from '../models/custorm-error';
import { EnvStyle } from '../models/enums/env-style.enum';

//services
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
// import { RouteEntityService } from './route-entity.service';
// import { CheckPointService } from './checkpoint.service';
// import { TasksService } from './tasks.service';
import { FileService } from './file.service';

export class AppService {

    private name = 'AppService';
    private app: App;
    private db: Firestore;
    private fireCloudStorage: Storage;
    private bucket: Bucket;

    public static servicesMap = new Map<string, any>();

    constructor() {
        console.log('AppService::init() start...');
    }

    async init(envStyle: EnvStyle): Promise<CustomError | boolean> {
        console.log(`${this.name} init start... nevironment style: ${EnvStyle[envStyle]}`);
        try {
            const credentials = {
                type: process.env.SA_TYPE,
                project_id: process.env.SA_PROJECT_ID,
                private_key_id: process.env.SA_PRIVATE_KEY_ID,
                private_key: process.env.SA_PRIVATE_KEY.replace(/\\n/g, '\n'),
                client_email: process.env.CLIENT_EMAIL,
                client_id: process.env.CLIENT_ID,
                auth_uri: process.env.AUTH_URI,
                token_uri: process.env.TOKEN_URI,
                auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
                client_x509_cert_url: process.env.AUTH_CLIENT_CERT_URL
            };

            this.setApp(await initializeApp({
                credential: cert(credentials as ServiceAccount),
                storageBucket: process.env.CLOUD_PROJECT_ID },
                'todo-back'
            ));

            this.setDb(await getFirestore(this.app));

            this.fireCloudStorage = new Storage({ keyFilename: 'google-cloud-key-gen.json', projectId: process.env.SA_PROJECT_ID });
            console.log('AppService FIRE CLOUD STORAGE INIT: ', this.fireCloudStorage);

            const serviceInitRes: boolean | CustomError = await this.initServices();
            return serviceInitRes;
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'AppService::init()');
        }
    }

    getName(): string {
        return this.name;
    }

    private async getApp(): Promise<App> {
        return this.app;
    }

    private async getDb(): Promise<Firestore> {
        return this.db;
    }

    private setApp(app: App) {
        if(app != null) {
            this.app = app;
        }
    }

    private setDb(db: Firestore) {
        if(db != null) {
            this.db = db;
        }
    }

    getService(key: string): any {
        return AppService.servicesMap.get(key);
    }

    setService(key: string, val: any) {
        if(key != null && key != "" && val != null) {
            AppService.servicesMap.set(key, val);
        }
        else {
            console.log('AppService::setService() You cannot set a service to null or empty string!');
        }
    }

    clearServices() {
        AppService.servicesMap.clear();
        console.log('AppService::clearService() servicesMap cleared: ', AppService.servicesMap);
    }

    private async initServices(): Promise<boolean | CustomError> {
        console.log('AppService::initServices()');
        let initRes: boolean | CustomError = true;
        try {
            const authService = new AuthService(this.db);
            const fileService = new FileService(this.fireCloudStorage);
            const fileUpload = await fileService.initMulter();
            if(fileUpload instanceof CustomError) {
                return fileUpload;
            }
            const userService = new UsersService(this.db);
            // const routeEntityService = new RouteEntityService(this.db);
            // const taskService = new TasksService(this.db);

            AppService.servicesMap.set('AuthService', authService);
            AppService.servicesMap.set('FileService', fileService);
            AppService.servicesMap.set('UsersService', userService);
            // AppService.servicesMap.set('RouteEntityService', routeEntityService);
            // AppService.servicesMap.set('TasksService', taskService);
            // (AppService.servicesMap.get('RouteEntityService') as RouteEntityService).setTaskService(taskService);
            console.log('AppService::initServices() initialization was successful! servicesMap: ', AppService.servicesMap);
        }
        catch(error) {
            if(error instanceof CustomError) {
                initRes = error;
            }
            else {
                initRes = new CustomError(error.name, error.message, 'AppService::initServices()');
            }
        }
        finally {
            return initRes;
        }
    }
}