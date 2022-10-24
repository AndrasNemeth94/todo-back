import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';
import { ITokens } from '../../../models/interfaces/ITokens';

//services
import { AuthService } from '../../../services/auth.service';

export const tokenRefreshHandler = (authService: AuthService) => async (req: Request, res: Response, next: NextFunction) => {
    const tokens: ITokens = {
        accessToken: req.body.accessToken,
        refreshToken: req.body.refreshToken
    }
    console.log('AuthRouter::tokenRefreshHandler() tokens: ', tokens);
    try {
        const tokenPair = await authService.verifyRefresh(tokens.accessToken, tokens.refreshToken);
        console.log('Refresh tokenPair: ', tokenPair);
        if(tokenPair instanceof CustomError) {
            res.status(500).send(tokenPair);
        }
        const freshTokens: ITokens = {
            accessToken: tokenPair[0],
            refreshToken: tokenPair[1]
        }
        res.status(200).send(freshTokens);
        res.end();
    }
    catch(error) {
        if(error instanceof CustomError) {
            res.status(500).send(error);
        }
        else {
            res.status(500).send(new CustomError(error.name, error.message, 'tokenRefreshHandler'));
        }
        res.end();
    }
}