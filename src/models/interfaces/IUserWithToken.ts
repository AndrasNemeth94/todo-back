export interface IUserWithToken {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    username?: string;
    profileImg?: string;
    routeIds?: string[];
    accessToken: string;
    refreshToken: string;
}