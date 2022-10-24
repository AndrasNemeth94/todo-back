import { TaskDuration } from "../enums/task-filter-duration.enum";
import { TaskStatus } from "../enums/task-status.enum";

export interface ITaskFilterDetails {
    routeId: string;
    duration?: TaskDuration;
    status?: TaskStatus;
    end?: string;
    start?: string;
}