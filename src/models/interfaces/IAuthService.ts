import { NextFunction, Request, Response } from "express";
import { CollectionReference, DocumentData } from "firebase-admin/firestore";
import { CustomError } from "../custorm-error";
import { ILoginData } from "./ILoginData";
import { IUserWithToken } from "./IUserWithToken";

export interface IAuthService {
    userCollectionRef: CollectionReference<DocumentData>;
    authUser(data: ILoginData):Promise<IUserWithToken | CustomError>;
    generateAccessToken(userId: string, permissions: string[]): Promise<string[] | CustomError>;
    checkPermissions(permissions: string[], url: string): Promise<boolean | CustomError>;
    verifyToken(req: Request, res: Response, next: NextFunction): Promise<void>;
}