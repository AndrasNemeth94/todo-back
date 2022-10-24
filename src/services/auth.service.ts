import { CollectionReference, DocumentData, Firestore } from 'firebase-admin/firestore';
import { Request, Response, NextFunction } from 'express';
import { uuidv4 } from '@firebase/util';
import * as jsonwebtoken from 'jsonwebtoken';
import { JwtPayload, SignOptions } from 'jsonwebtoken';
import  * as dotenv from 'dotenv';
dotenv.config();

//models
import { CustomError } from '../models/custorm-error';
import { ILoginData } from '../models/interfaces/ILoginData';
import { blackList } from '../models/user-blacklist';
import { IAuthService } from '../models/interfaces/IAuthService';
import { IUserWithToken } from '../models/interfaces/IUserWithToken';
import { ICustomHttpHeader } from '../models/interfaces/ICustomHttpHeader';
import { IUser } from '../models/interfaces/IUser';

export class AuthService implements IAuthService {

    userCollectionRef: CollectionReference<DocumentData>;
    clientCollection: CollectionReference<DocumentData>; 

    constructor(db: Firestore) {
        this.userCollectionRef = db.collection('users');
        this.clientCollection = db.collection('clients');
    }

    async authUser(data: ILoginData): Promise<IUserWithToken | CustomError> {
        console.log('AuthService::authUser() data: ', data);
        try {
            const user = await this.getUser(data.email, data.password);
            if(typeof user === 'string') {
                return new CustomError('ClientError', user, 'AuhService::authUser()');
            }
            const tokens: string[] | CustomError = await this.generateAccessToken(user.id, user.permissions);
            if(tokens instanceof CustomError) {
                return tokens;
            }
            const userRes: IUserWithToken = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                profileImg: user?.profileImg || '',
                routeIds: user?.routeIds || [],
                accessToken: tokens[0],
                refreshToken: tokens[1]
            }
            return userRes;
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'AuthService::authUser()');
        }
    }

    async getUser(email: string, pw: string): Promise<IUser | string> {
        console.log('AuthService::getUserOne() email: ' + email, ', pw: ' + pw);
        try {
            const getUsers = await this.userCollectionRef.where('email', '==', email).get();
            console.log('getUsers: ', getUsers.docs);
            if(getUsers.docs.length > 0 && getUsers.docs[0].exists) {
                const user = getUsers.docs[0].data() as IUser;
                if(user.password === pw) {
                    return user;
                }
                else {
                    throw Error('Password does not match!');
                }
            }
            else {
                throw Error('User with the given email does not exist!');
            }
        }
        catch(error) {
            return error.message;
        }
    }

    async generateAccessToken(userId: string, permissions: string[]): Promise<CustomError | string[]> {
        try {
            const refreshId = uuidv4();
            const signOptions: SignOptions = {
                algorithm: 'HS256',
                audience: 'TodoClient',
                issuer: 'TodoServer',
                subject: 'AccessToken',
                expiresIn: '1h'
            };
            const payload = {
                userId: userId,
                permissions: permissions,
                refId: refreshId
            };
            const accessToken = await jsonwebtoken.sign(payload,process.env.AUTH_TOKEN_PRIVATE_KEY, signOptions);
            const refreshToken = await this.generateRefreshToken(userId, refreshId, signOptions);
            console.log('AuthService::generateAccessToken() tokens: ', accessToken, 'refresh: ', refreshToken);
            return [accessToken, refreshToken];
        }
        catch(err) {
            return new CustomError(err.name,err.message,'AuthService::generateToken()');
        }
    }

    async generateRefreshToken(userId: string, refId: string, signatureOptions: SignOptions): Promise<string> {
        let refSignature = signatureOptions;
        refSignature.expiresIn = '1d';
        const refresh = await jsonwebtoken.sign({
            id: refId,
            userId: userId
        }, process.env.REFRESH_TOKEN_SECRET, refSignature);
        return refresh;
    }

    async checkPermissions(permissions: string[], url: string): Promise<boolean | CustomError> {
        console.log('AuthService::checkpermissions() permissions: ', permissions, ' url: ', url);
        let authRes: CustomError | boolean = true;
        if(permissions.includes('admin')) {
            return authRes;
        }
        else {
            const notCallable = blackList.find(item => item === url);
            console.log('AuthService::checkPermissions() notCallable: ', notCallable);
    
            notCallable != null ?
            authRes = new CustomError('PermissionError','User with permission *user* is not permitted to use this endpoint!', 'AuthService::checkPermission()'):
            authRes;
        }
        console.log('AUTHRES: ', authRes);
        return authRes;
    }

    async verifyRefresh(accessToken: string, refreshToken: string): Promise<CustomError | string[]> {
        let result: string[] | CustomError;
        try {
            const payload: string | JwtPayload = await jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const id: string = payload['id'];

            id ? result = await this.verifyAccess(accessToken, id):
            result = new CustomError('RefreshTokenIdError', 'Given refreshToken has no Id!','AuthService::verifyRefresh()');

            console.log('verifyRefresh result: ', result);
            return result;
        }
        catch(error) {
            new CustomError(error.name, error.message, 'AuthService::verifyRefresh()');  
        }
        return result;
    }

    async verifyAccess(accessToken: string, refId: string): Promise<string[] | CustomError> {
        try {
            let finalRes;
            const decoded = await jsonwebtoken.decode(accessToken);
            if(refId === decoded['refId']) {
                const reGen = await this.generateAccessToken(decoded['userId'], decoded['permissions']);
                finalRes = reGen;
            }
            else {
                finalRes = new CustomError('TokenIdMismatch', 'Refresh id doesnt match access Id!', 'AuthService::verifyAccess()');
            }
            console.log('verifyAccess finalRes: ', finalRes);
            return finalRes;
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'AuthService::verifyAccess()');
        }
    }

    async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        const tokenWithBearer = req.headers['authorization'];
        const endPoint = req.originalUrl;
        console.log('REQUEST FULL:: verifyToken(): ', req['originalUrl'], ' tokenWithBearer: ', tokenWithBearer);
        const token = tokenWithBearer.slice(7);
        console.log('verifyTOKEN: ' + token);
        console.log
        if(token != null) {
            try {
                const decoded: string | JwtPayload = await jsonwebtoken.verify(token, process.env.AUTH_TOKEN_PRIVATE_KEY);
                console.log('DECODED: ', decoded);
                const isPermitted: boolean | CustomError = await this.checkPermissions(decoded['permissions'], endPoint);
                console.log('PERMITTED: ', isPermitted);
                if(isPermitted) {
                    next();
                }
                else {
                    res.status(401).send(isPermitted);
                    res.end();
                }
            }
            catch(error) {
                res.status(500).send(new CustomError(error.name, error.message, 'AuthService::verifyToken()'));
                res.end();
            }
        }
        else {
            res.status(404).send(new CustomError('JWTError', 'No accesstoken found in header!', 'AuthService::verifyToken()'));
            res.end();
        }
    }
}