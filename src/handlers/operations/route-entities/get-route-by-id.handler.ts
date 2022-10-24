import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';

//services
import { RouteEntityService } from "../../../services/route-entity.service";

export const getRouteEntityById = (routeEntityService: RouteEntityService) => async (req: Request, res: Response, next: NextFunction) => {
    let routeEntityId = req.query.id as string;
    try {
        const routeEntity = await routeEntityService.getRouteEntityById(routeEntityId);
        if(routeEntity instanceof CustomError) {
            res.status(500).send(new CustomError(routeEntity.name, routeEntity.message, 'RouteEntityRouter::getRouteEntityById()'));
        }
        else {
            res.status(200).send(routeEntity);
        }
        res.end();
    }
    catch(error) {
        res.status(500).send(new CustomError(error.name, error.message, 'RouteEntityRouter::getRouteEntityById()'));
        res.end();
    }
}