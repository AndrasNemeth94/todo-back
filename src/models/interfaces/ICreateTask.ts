import { TaskStatus } from "../enums/task-status.enum";

export interface ICreateTask {
    name: string;
    status: TaskStatus;
    description?: string;
    duration: number;
    start: string;
    end: string;
    routeId?: string;
}