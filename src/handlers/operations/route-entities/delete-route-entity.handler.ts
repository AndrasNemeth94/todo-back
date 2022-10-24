import { Request, Response, NextFunction } from 'express';

//models
import { CustomError } from '../../../models/custorm-error';

//serices
import { RouteEntityService } from "../../../services/route-entity.service";

export const deleteRouteEntityHandler = (routeEntityService: RouteEntityService) => async (req: Request, res: Response, next: NextFunction) => {
    const routeEntityId = req.query.id as string;
    try {
        const delRes = await routeEntityService.deleteRouteEntityById(routeEntityId);
        if(delRes instanceof CustomError) {
            res.status(500).send(delRes);
        }
        else {
            res.status(500).send(delRes);
        }
        res.end();
    }
    catch(error) {
        res.status(500).send(new CustomError(error.name, error.message, 'RouteEntityRouter::deleteRouteEntityHandler()'));
        res.end();
    }
}