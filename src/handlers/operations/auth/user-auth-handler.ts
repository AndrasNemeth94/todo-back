import { Request, Response, NextFunction } from 'express';

//services
import { AuthService } from '../../../services/auth.service';

//models
import { ILoginData } from '../../../models/interfaces/ILoginData';
import { IUserWithToken } from '../../../models/interfaces/IUserWithToken';
import { CustomError } from '../../../models/custorm-error';

export const userAuthHandler = (authService: AuthService) => async (req: Request, res: Response, next: NextFunction) => {
    let loginData: ILoginData = req.body;
    console.log('authRouter::login loginData: ', loginData);
    try {
        const loginRes: IUserWithToken | CustomError = await authService.authUser(loginData);
        if(loginRes instanceof CustomError) {
            res.status(500).send(loginRes);
        }
        else {
            res.status(200).send(loginRes);
        }
        res.end();
    }
    catch(error) {
        res.status(500).send(new CustomError(error.name, error.message, 'AuthRouter::login'));
        res.end();
    }
}