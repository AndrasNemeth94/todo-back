import { RouteCategory } from "../enums/route-category.enum";
import { RouteStatus } from "../enums/route-status.enum";

export interface IRouteEntity {
    id: string;
    name: string;
    description?: string;
    category: RouteCategory;
    routeStart: string;
    routeEnd: string;
    duration: number;
    status: RouteStatus;
    tasks: string[];
    userId: string;
}