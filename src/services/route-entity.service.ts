import { CollectionReference, DocumentData, Firestore, QueryDocumentSnapshot, WriteResult } from "firebase-admin/firestore";
import moment from 'moment';

//models
import { CustomError } from "../models/custorm-error";
import { RouteStatus } from "../models/enums/route-status.enum";
import { TimezonesEUR } from "../models/enums/timezonesEUR.enum";
import { ICreateRouteEntity } from "../models/interfaces/ICreateRouteEntity";
import { IRouteEntity } from "../models/interfaces/IRouteEntity";
import { ITask } from "../models/interfaces/ITask";
import { ITaskFilterDetails } from "../models/interfaces/ITaskFilterDetails";
import { momentTimeDiff } from "../utils/times";

//services
import { TasksService } from "./tasks.service";

export class RouteEntityService {

    private routerCollectionRef: CollectionReference;
    private tasksService: TasksService;

    constructor(db: Firestore) {
        try {
            this.routerCollectionRef = db.collection('route-entity');
        }
        catch(error) {
            throw new CustomError(error.name, error.message, 'RouteEntityService::constructor()');
        }
    }

    setTaskService(tasksService: TasksService) {
        if(tasksService instanceof TasksService) {
            this.tasksService = tasksService;
            console.log('RouteEntityService::setTaskService() taskService is set!');
        }
    }

    async listRouteEntities(userId: string): Promise<IRouteEntity[] | CustomError> {
        console.log('RouteEntityService::listRouteEntities() userId: ', userId);
        try {
            let routes = [];
            const routeDocs = await this.routerCollectionRef.where('userId', '==', userId).get();
            if(routeDocs.docs.length > 0) {
                console.log('DOCS: ', routeDocs.docs);
                await routeDocs.docs.map((route: QueryDocumentSnapshot<DocumentData>) => {
                    routes.push(route.data() as IRouteEntity);
                })
            }
            console.log('RouteEntityService::listRouteEntities() routes: ', routes);
            return routes;
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'RouteEntityService::listRouteEntities()');
        }
    }

    async getRouteEntityById(id: string): Promise<CustomError | IRouteEntity> {
        console.log('RouteEntityService::getRouteEntityById() id: ', id);
        try {
            const docRef = this.routerCollectionRef.doc(id);
            let route = await (await docRef.get()).data() as IRouteEntity;
            console.log('RouteEntityService::getRouteEntityById() route: ', route);
            if(route === null || route === undefined) {
                return new CustomError('ClientError', `Cannot find routeEntity with id:${id}!`, 'RouteEntityService::getRouteEntityById()');
            }
            return route;
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'RouteEntityService::getRouteEntityById()');
        }
    }

    async createRouteEntity(routeEntity: ICreateRouteEntity): Promise<CustomError | IRouteEntity> {
        console.log('RouteEntityService::getRouteEntityById() routeEntity: ', routeEntity);
        try {
           const docRef = await this.routerCollectionRef.add(routeEntity);
           const entity = await docRef.get().then(snapShot => {
                return snapShot.data() as IRouteEntity;
           })
           return entity;
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'RouteEntityService::createRouteEntity()');
        }
    }

    async updateRouteEntityById(routeEntity: IRouteEntity): Promise<CustomError | IRouteEntity> {
        console.log('RouteEntityService::updateRouteEntityById() routeEntity: ', routeEntity);
        try {
            const prevRouteEntity: IRouteEntity | CustomError = await this.getRouteEntityById(routeEntity.id);
            if(prevRouteEntity instanceof CustomError) {
                return prevRouteEntity;
            }
            else if(prevRouteEntity.userId !== routeEntity.userId) {
                return new CustomError('ClientError', 'You cannot assign a task to another user!', 'RouteEntityService::updateRouteEntityById()');
            }
            else {
                if(routeEntity.tasks.length > 0) {

                }
                const isStartClear = new Date(routeEntity.routeStart) <= new Date(prevRouteEntity.routeStart) ? true: false;
                const prevEnd = new Date(routeEntity.routeEnd) <= new Date(prevRouteEntity.routeEnd);
            }
            //startTime csak visszafelé módosíthat, kivéve ha nincs benne task, de ekkor az endTime-nál kisebbnek kell lennie! 
            //endTime nem lehet múltban és currentDate-nél min. 1órával nagyobb!
            //taskok -> query összeset! -> ahol a legnagyobb az endTime(utolsó task) <- routeEnd nem lehet kisebb mint utolsó task endTime!
            //route duration újraszámol!
            //visszafelé nincs dokumentálás!
            let updatedEntity: IRouteEntity;
            const updateRes: WriteResult = await this.routerCollectionRef.doc(routeEntity.id).update(routeEntity as {[x: string]: any});
            console.log('RouteEntityService::updateRouteEntityById() updateRes: ', updateRes);

            if(updateRes instanceof WriteResult) {
                const snapShot = await this.routerCollectionRef.doc(routeEntity.id).get();
                updatedEntity = await snapShot.data() as IRouteEntity;
            }
            else {
                return new CustomError('ClientError', `RouteEntity update failed, result:${updateRes}`, 'RouteEntityService::updateRouteEntityById()');
            }
            return updatedEntity;
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'RouteEntityService::updateRouteEntityById()');
        }
    }

    async deleteRouteEntityById(id: string): Promise<CustomError | WriteResult> {
        console.log('RouteEntityService::deleteRouteEntityById() id: ', id);
        try {
            if(id) {
                const deleteRes = await this.routerCollectionRef.doc(id).delete();
                return deleteRes;
            }
            else {
                return new CustomError('ClientError', 'RouteEntityId is null!', 'RouteEntityService::deleteRouteEntityById()');
            }
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'RouteEntityService::deleteRouteEntityById()');
        }
    }

    async isEndAndStartClean(start: string, end: string, compareStart: string, compareEnd: string, timezone: TimezonesEUR, isTask: boolean): Promise<CustomError[]> {
        console.log('RouteEntityService::isEndAndStartClean() start: ', start, ', end: ', end, ', compareStart: ',
        compareStart, ', compareEnd: ', compareEnd, ', current timezone: ', TimezonesEUR[timezone]);

        let cErr = [];
        const startTime = moment(start).tz(timezone);
        const compareStartTime = moment(compareStart).tz(timezone);
        const endTime = moment(end).tz(timezone);
        const compareEndTime = moment(compareEnd).tz(timezone);

        if(startTime > compareStartTime && !isTask) {
            cErr.push(
                new CustomError('RouteTimeError', `New route start time (${startTime}) cannot be a later date compared to previous route startdate (${compareStartTime})!`, 'RouteEntityService::isEndAndStartClean()')
            );
        }
        if(startTime < compareStartTime && isTask) {
            cErr.push(
                new CustomError('TaskTimeError', `Task start time (${startTime}) cannot be an earlier date compared to routeStart time: (${compareStartTime})!`, 'RouteEntityService::isEndAndStartClean()')
            );
        }
        if(endTime < compareEndTime && !isTask) {
            cErr.push(
                new CustomError('RouteTimeError', `New Route start date (${endTime}) cannot be a previous date compared to comparedEndTime (${compareEndTime})!`,'RouteEntityService::isEndAndStartClean()')
            );
        }
        if(endTime > compareEndTime && isTask) {
            cErr.push(
                new CustomError('TaskTimeError', `Task endtime (${endTime}) cannot be a after route end time (${compareEndTime})!`,'RouteEntityService::isEndAndStartClean()')
            );
        }
        return cErr;
    }

    async getAllTasksByRouteId(routeId: string): Promise<CustomError | ITask[]> {
        console.log('RouteEntityService::getAllTasksByRouteId() routeId: ', routeId);
        try {
            const filterParams: ITaskFilterDetails = {
                routeId: routeId
            }
            const taskList = await this.tasksService.getTaskList(filterParams);
            return taskList;
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'RouteEntityService::getAllTasksByRouteId()');
        }
    }

    async checkAllTaskInRoute(tasks: ITask[], route: IRouteEntity, timezone: TimezonesEUR): Promise<ITask[] | CustomError[]> {
        console.log('RouteEntityService::checkAllTaskInRoute() tasks: ', tasks, ' route: ', route);
        try {
            let taskErrors = []
            tasks.forEach(async (task) => {
                const isClean = await this.isEndAndStartClean(task.start, task.end, route.routeStart, route.routeEnd, timezone, true);
                if(isClean.length > 0) {
                    taskErrors = isClean;
                }
            })
        }
        catch(error) {
            return [new CustomError(error.name, error.message, 'RouteEntityService::checkAllTaskInRoute()')];
        }
    }

    async checkNewRoute(newRoute: ICreateRouteEntity, timezone: TimezonesEUR): Promise<CustomError[] | true> {
        console.log('RouteEntityService::checkNewRoute() newRoute: ', newRoute, ', timezone: ', TimezonesEUR[timezone]);
        const currentDate = moment().tz(timezone).toString();

        if(newRoute.tasks.length > 0) {
            //route is being created, not updated!
            const isStartEndClean = await this.isEndAndStartClean(newRoute.routeStart, newRoute.routeEnd, currentDate, newRoute.routeStart, timezone, false);
            if(isStartEndClean.length > 0) {
                return isStartEndClean;
            }
            else {
                //tasks start and end time should not be at the same time, task startTime cannot be equal to routeEndTime,
            }
        }
        else {
            //route is empty -> deletable, updateable, status is inactive!
        }
    }

    async checkUpdatedRoute(newRoute: IRouteEntity, prevRoute: IRouteEntity, timezone: TimezonesEUR): Promise<CustomError[] | IRouteEntity> {
        console.log('RouteEntityService::checkUpdatedRoute() newRoute: ', newRoute, ', prevRoute: ', prevRoute, 'timezone: ', TimezonesEUR[timezone]);
        if(newRoute.userId !== prevRoute.userId) {
            return [
                new CustomError(
                    'UpdateError',
                    `You cannot change the Id of the user ${prevRoute.userId} with a new userId: ${newRoute.userId}!`,
                    'RouteEntityService::checkUpdatedRoute()'
                )
            ]
        }
        if(newRoute.tasks.length > 0) {
            //need all tasks assigned to this route
            const tasks = await this.getAllTasksByRouteId(newRoute.id);
            if(tasks instanceof CustomError) {
                return [tasks];
            }
            else {

            }
        }
        else {
            newRoute.status = RouteStatus.inactive;
            const isEndAndStartClean = await this.isEndAndStartClean(newRoute.routeStart, newRoute.routeEnd, prevRoute.routeStart, prevRoute.routeEnd, timezone, false);
            if(isEndAndStartClean.length > 0) {
                return isEndAndStartClean;
            }
            else {
                //set duration
                const diff = await momentTimeDiff(newRoute.routeStart, newRoute.routeEnd, timezone);
                console.log('RouteEntityService::checkUpdatedRoute() calculated diff: ', diff);
                newRoute.duration = diff;
            }
            return newRoute;
        }
    }
}