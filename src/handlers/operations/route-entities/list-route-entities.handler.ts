import { Request, Response, NextFunction } from "express";

//models
import { CustomError } from "../../../models/custorm-error";

//services
import { RouteEntityService } from "../../../services/route-entity.service";

export const listRouteEntities = (routeEntitiesService: RouteEntityService) => async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.query.id as string;
    try {
        const allRoutes = await routeEntitiesService.listRouteEntities(userId);
        if(allRoutes instanceof CustomError) {
            res.status(500).send(allRoutes);
        }
        else {
            res.status(200).send(allRoutes);
        }
        res.end();
    }
    catch(error) {
        res.status(500).send(new CustomError(error.name, error.message, 'RouteEntityRouter::listRouteEntities()'));
        res.end();
    }
}