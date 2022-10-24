//cloud-storage
import { Bucket, Storage } from '@google-cloud/storage';

//multer
import multer from 'multer';
import { Options } from 'multer';

//models
import { CustomError } from '../models/custorm-error';

export class FileService {

    name = 'FileService';

    private storage: Storage;
    private bucket: Bucket;
    public fileURL: string;

    private upload: multer.Multer;
    public userId: string = 'userIdPlaceholder';
    public multerSettings: Options;

    constructor(storage: Storage) {
        try {
            this.storage = storage;
            this.bucket = this.storage.bucket(process.env.CLOUD_PROJECT_ID);
            console.log('FileService::constructor() storage bucket init successful! BUCKET: ', this.bucket);
        }
        catch(error) {
            throw new CustomError(error.name, error.message, 'FileService::constructor()');
        }
    }

    public async initMulter(): Promise<CustomError | any> {
        try {
            this.setMulter();
            console.log('FileService: Multer (re)init finished!');
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'FileService::initMulter()');
        }
    }

    public setUserId(id: string) {
        if(id != null) {
            this.userId = id;
        }
        console.log('FileService id set: ', this.getUserId());
    }

    public getUserId() {
        return this.userId;
    }

    public setMulter(): multer.Multer | CustomError {
        console.log('FileService::setMulter() start...');
        try {
                this.upload = multer({
                    storage: multer.memoryStorage(),
                    limits: {
                        fileSize: 1 * 1024 * 1024, //1MB
                    }
                })
                console.log('FileService::setMulter() setting up multer with constructed storage finsihed!');
                return this.upload;
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'FileService::setMulter()');
        }
    }

    getMulter(): multer.Multer {
        console.log('FileService::getMulter()');
        return this.upload;
    }

    async uploadPfpImage(file: Express.Multer.File): Promise<CustomError | string> {
        console.log('UsersService::uploadPfpImage() file: ', file);

        try {

            const userId = this.getUserId();
            const blobFile = this.bucket.file('users/images/' + userId + '_' + file.originalname);
            let res: CustomError | string;

            return new Promise<string | CustomError>((resolve, rejected) => {
                const fileStream = blobFile.createWriteStream();
                fileStream.on('error', (error: Error) => {
                    res = new CustomError(error.name, error.message, 'FileService::fileStreamProcess()');
                    rejected(res);
                })
                fileStream.end(file.buffer);
                fileStream.on('finish', () => {
                    res = `https://storage.googleapis.com/${this.bucket.name}/${blobFile.name}`;
                    console.log('STREAM FINISHED URL: ', res);
                    resolve(res);
                })
            })
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'FileService::uploadPfpImage()');
        }
    }
}