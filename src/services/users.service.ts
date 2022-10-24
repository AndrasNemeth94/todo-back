import { CollectionReference, DocumentData, DocumentReference, DocumentSnapshot, Firestore, QueryDocumentSnapshot, QuerySnapshot, UpdateData, WriteResult } from "firebase-admin/firestore";

//regex
import { emailReg, pwRegex } from "../utils/regexes";

//models
import { CustomError } from "../models/custorm-error";
import { IUser } from "../models/interfaces/IUser";
import { ICredentials } from "../models/interfaces/ICredentials";
import { ILoginData } from '../models/interfaces/ILoginData';
import { IRegisterUser } from "../models/interfaces/IRegisterUser";
import { instance } from "gaxios";
import { IUserSecurityQuestion } from "../models/interfaces/IUserSecurityQuestion";
import { IResetPassword } from "../models/interfaces/IResetPassword";
import { IUpdateUser } from "../models/interfaces/IUpdateUser";

export class UsersService {

    private name = 'UsersService';
    private usersCollectionRef: CollectionReference<DocumentData>;
    public db: Firestore;

    constructor(db: Firestore) {
        console.log(`${this.name} init start with db: ${db}`);
        try {
            this.db = db;
            this.usersCollectionRef = db.collection('users');
            console.log(`${this.name} has inited collection: ${this.usersCollectionRef}`);
        }
        catch(error) {
            throw error;
        }
    }

    getName(): string {
        return this.name;
    }

    async getUsers(): Promise<IUser[] | CustomError> {
        console.log(`${this.name}::getUsers()`);
        try {
            let usersList: IUser[] = [];
            await this.usersCollectionRef.get().then((querySnapShot: QuerySnapshot<DocumentData>) => {
                return querySnapShot.docs.map((user: QueryDocumentSnapshot) => {
                    const newUser: IUser = {
                        id: user.id,
                        firstName: user.get('firstName'),
                        lastName: user.get('lastName'),
                        email: user.get('email'),
                        password: user.get('password'),
                        profileImg: user.get('profileImg'),
                        username: user.get('username'),
                        routeIds: user.get('routeIds'),
                        permissions: user.get('permissions'),
                        securityQuestion: user.get('securityQuestion'),
                        answer: user.get('answer'),
                        timezone: user.get('timezone')
                    }
                    usersList.push(newUser);
                });
            });
            console.log('UsersService::getUsers() list: ', usersList);
            return usersList;
        }
        catch(error: any) {
            return new CustomError(error.name,error.message,'UsersService::getUsers()');
        }
    }

    async getUserById(userId: string): Promise<IUser | CustomError> {
        console.log('UsersService::getUserById() userId: ', userId);
        try {
            const user = await (await this.usersCollectionRef.doc(userId).get()).data();
            console.log('FOUND USER: ', user);
            if(user === undefined) {
                return new CustomError('ClientError', `User with the given id:${userId} is not found!`, 'UsersService::getUserById()');
            }
            const currentUser: IUser = {
                id: userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profileImg: user?.profileImg || '',
                username: user.username,
                routeIds: user.routeIds || [],
                permissions: user.permissions,
                securityQuestion: user.securityQuestion,
                answer: user.answer,
                timezone: user.timezone
            }
            console.log('UsersService::getUserById() user found: ', currentUser);
            return currentUser;
        }
        catch(error: any) {
            return new CustomError(error.name,error.message,'UsersService::getUserById()');
        }
    }

    async createUser(user: IRegisterUser): Promise<string | CustomError> {
        console.log('UsersService::createUser() user: ', user);
        try {
            return this.usersCollectionRef.add(user).then((docRef: DocumentReference) => {
                return docRef.id;
            });
        }
        catch(error) {
            return new CustomError(error.name,error.message,'UsersService::createUser()'); ;
        }
    }

    checkUserProps(obj: Object, props: string[]): Array<string> {
        let missing = [];
        props.forEach(prop => {
            if(!obj.hasOwnProperty(prop) || obj[prop] === null || obj[prop] === "") {
                missing.push(prop);
            }
        });
        console.log('UsersService::checkUserProps() missing: ', missing);
        return missing;
    }

    async deleteUserById(id: string): Promise<CustomError | WriteResult> {
        try {
            let userDocRef: DocumentReference = this.usersCollectionRef.doc(id);
            console.log('DELETE USER REF ID: ', userDocRef.id);
            if(userDocRef.id !== null) {
                return userDocRef.delete().then((value: WriteResult) => {
                    console.log('DEL VAL: ', value);
                    return value;
                });
            }
            else {
                return new CustomError('UserDeleteError', 'User with this id does not exist!', 'UsersService::deleteUserById()');
            }
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'UsersService::deleteUserByID()');
        }
    }

    async updateUserById(id: string, updatedUser: IUpdateUser): Promise<string | CustomError> {
        console.log('UsersService::updateUserById() id: ', id, 'updatedUser: ', updatedUser);
        try {
            const updatedInstance = await this.usersCollectionRef.doc(id).update(updatedUser as { [x: string]: any; });
            console.log('UsersService::updateUserById() updatedInstance: ', updatedInstance);
            return id;
        }
        catch(error) {
            return new CustomError(error.name, error.message,'UsersService::updateUserById()');
        }
    }

    async resetPassword(resetPw: IResetPassword): Promise<string | CustomError> {
        console.log('UsersService::resetPassword() resetPw: ', resetPw);
        try {
            const isMatch = await this.checkResetPwAnswer(resetPw.answer, resetPw.id);
            if(isMatch === true) {
                const updateRes = await this.usersCollectionRef.doc(resetPw.id).update({ 'password': resetPw.password });
                if(updateRes instanceof WriteResult) {
                    return `Password of the user: ${resetPw.id} has been reset successfully!`;
                }
            }
            else if(isMatch instanceof CustomError) {
                return isMatch;
            }
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'UsersService::resetPassword()');
        }
    }

    async checkResetPwAnswer(userAnswer: string, userId: string): Promise<boolean | CustomError> {
        console.log('UsersService::checkResetPwAnswer() userAnswer: ' + userAnswer, ' userId: ' + userId);
        try {
            return this.usersCollectionRef.doc(userId).get().then((doc: DocumentSnapshot<DocumentData>) => {
                if(doc.data()) {
                    const user: IUser = doc.data() as IUser;
                    const userA = userAnswer.toLowerCase();
                    const dbA = user.answer.toLowerCase();
                    if(user.answer) {
                        if(userA === dbA) {
                            return true;
                        }
                        else {
                            return new CustomError('ClientError', 'Given answer doesnt match!', 'UsersService::checkResetPwAnswer()');
                        }
                    }
                    else {
                        return new CustomError('ClientError', `User ${userId} doesnt have a security answer!`, 'UsersService::checkResetPwAnswer()');  
                    }
                }
                else {
                    return new CustomError('ClientError', `Cannot find user with the given id: ${userId}`, 'UsersService::checkResetPwAnswer()');
                }
            })
        }
        catch(error) {
            return new CustomError(error.name, `Cannot find user with the given id: ${userId}`, 'UsersService::checkResetPwAnswer()');
        }
    }

    async getUserByEmail(email: string): Promise<IUserSecurityQuestion | CustomError> {
        console.log('UsersService::getUserByEmail() email: ' + email);
        try {
            return this.usersCollectionRef.where('email', '==', email).get().then((res: QuerySnapshot<DocumentData>) => {
                if(res.docs.length > 0) {
                    if(res.docs[0].data().securityQuestion) {
                        const userSecQuestion: IUserSecurityQuestion = {
                            id: res.docs[0].data()?.id || '',
                            securityQuestion: res.docs[0].data().securityQuestion || ''
                        }
                        return userSecQuestion;
                    }
                    else {
                        return new CustomError('ClientError', 'User with the given email doesnt have securityQuestion!', 'UsersService::getUserByEmail()');
                    }
                }
                else {
                    return new CustomError('ClientError', 'User with the given email doesnt exist!', 'UsersService::getUserByEmail()');
                }
            })
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'UsersService::getUserByEmail()');
        }
    }

    async checkEmailAndPassword(pw: string, email: string): Promise<ICredentials | CustomError> {
        console.log('UsersService::checkEmailAndPassword() pw: ', pw, ' email: ', email);
        if(!pwRegex.test(pw)) {
            return new CustomError('ClientError', 'Password should be 3 alphanumeric, 2 numbers, 1 unique!','UsersService()::checkEmailAndPassword()');
        }
        if(!emailReg.test(email)) {
            return new CustomError('ClientError', 'Email is not valid','UsersService()::checkEmailAndPassword()');
        }
        try {
            const emailDoc = await (await this.usersCollectionRef.limit(1).where('email', '==', email).get()).docs[0];
            const pwDoc = await (await this.usersCollectionRef.limit(1).where('password', '==', pw).get()).docs[0];
            if(emailDoc != null) {
                return new CustomError('EmailDuplicate', 'User is already registrated on this email!', 'UsersService::checkEmailAndPassword()');
            }
            if(pwDoc != null) {
                return new CustomError('PasswordExists', 'This password already exists!', 'UsersService::checkEmailAndPassword()');
            }
            else if(pwDoc === null && emailDoc === null) {
                return ({ email: true, password: true } as ICredentials);
            }
        }
        catch(error: any) {
            return new CustomError(error.name ,error.message, 'UsersService::checkEmailAndPassword()');
        }
    }

    private compareQuestionToAnswer(answer: string, userAnswer: string): CustomError | boolean {
        console.log('UsersService::compareQuestionToAnswer() answer: ' + answer + ' ,userAnswer: ', userAnswer);
        try {
            if(answer !== null) {
                if(answer === userAnswer) {
                    return true;
                }
                else {
                    return new CustomError('SecurityQuestionError', 'Users security answer does not match answer!', 'UsersService::compareQuestionToAnswer()');
                }
            }
            else {
                return new CustomError('SecurityQuestionError', 'Users security answer is null!', 'UsersService::compareQuestionToAnswer()');
            }
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'UsersService::compareQuestionToAnswer()');
        }
    }
}