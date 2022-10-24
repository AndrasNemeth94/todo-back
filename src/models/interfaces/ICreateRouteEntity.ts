import { RouteCategory } from "../enums/route-category.enum";
import { RouteStatus } from "../enums/route-status.enum";

export interface ICreateRouteEntity {
    name: string;
    description?: string;
    category: RouteCategory;
    routeStart: string; //timestamp
    routeEnd: string; //timestamp
    duration: number;
    tasks: string[];
    status: RouteStatus;
    userId: string;
}