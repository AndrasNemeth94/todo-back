import { Permission } from "../enums/permission.enum";

export interface IUpdateUser {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    username?: string;
    profileImg?: string;
    permissions?: Permission[];
    routeIds?: string[];
    securityQuestion?: string;
    answer?: string;
    timezone?: string;
}