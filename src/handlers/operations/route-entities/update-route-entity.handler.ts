import { Request, Response, NextFunction } from 'express'

//models
import { CustomError } from '../../../models/custorm-error';
import { IRouteEntity } from '../../../models/interfaces/IRouteEntity';

//services
import { RouteEntityService } from "../../../services/route-entity.service";

export const updateRouteEntityHandler = (routeEntityService: RouteEntityService) => async (req: Request, res: Response, next: NextFunction) => {
    const routeEntity = req.body as IRouteEntity;
    try {
        const updateRes = await routeEntityService.updateRouteEntityById(routeEntity);
        if(updateRes instanceof CustomError) {
            res.status(500).send(updateRes);
        }
        else {
            res.status(200).send(updateRes);
        }
        res.end();
    }
    catch(error) {
        res.status(500).send(new CustomError(error.name, error.message, 'RouteEntityRouter::updateRouteEntityHandler()'));
        res.end();
    }
}