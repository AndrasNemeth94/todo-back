import moment from 'moment';
import { getCurrentDate } from '../utils/times';

export class CustomError implements Error {

    location: string;
    name: string;
    message: string;
    timestamp: string;
    

    constructor(name: string, message: string, location: string) {
        this.name = name;
        this.message = message;
        this.location = location;
        this.timestamp = this.getTimestamp();
    }

    getMsg() {
        return this.message;
    }

    setMsg(newMsg: string) {
        if(newMsg != "") {
            this.message = newMsg;
        }
    }

    getName() {
        return this.name;
    }

    setName(newName: string) {
        if(newName != "") {
            this.name = newName;
        }
    }

    getTimestamp(): string {
        const errAt = getCurrentDate();
        console.log('CustomError::getTimeStamp() ', errAt);
        return errAt;
    }
}