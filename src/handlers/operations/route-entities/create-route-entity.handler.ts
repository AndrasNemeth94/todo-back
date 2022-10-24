import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';
import { ICreateRouteEntity } from '../../../models/interfaces/ICreateRouteEntity';

//servcies
import { RouteEntityService } from "../../../services/route-entity.service";

export const createRouteEntityHandler = (routeEntityService: RouteEntityService) => async (req: Request, res: Response, next: NextFunction) => {
    const routeEntity = req.body as ICreateRouteEntity;
    try {
        //is there any taskIds? => no: denied
        //get list of tasks for 
        const createRes = await routeEntityService.createRouteEntity(routeEntity);
        if(createRes instanceof CustomError) {
            res.status(500).send(createRes);
        }
        else {
            res.status(200).send(createRes);
        }
        res.end();
    }
    catch(error) {
        res.status(500).send(new CustomError(error.name, error.message, 'RouteEntityRouter::createRouteEntityHandler()'));
        res.end();
    }
}