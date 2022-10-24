import { CollectionReference, DocumentData, Firestore, QueryDocumentSnapshot, WriteResult } from "firebase-admin/firestore";

//models
import { CustomError } from "../models/custorm-error";
import { TaskDuration } from "../models/enums/task-filter-duration.enum";
import { TaskStatus } from "../models/enums/task-status.enum";
import { ICreateTask } from "../models/interfaces/ICreateTask";
import { ITask } from "../models/interfaces/ITask";
import { ITaskFilterDetails } from "../models/interfaces/ITaskFilterDetails";

export class TasksService {

    private taskCollectionRef: CollectionReference;

    constructor(db: Firestore) {
        try {
            this.taskCollectionRef = db.collection('tasks');
        }
        catch(error) {
            throw new CustomError(error.name, error.message, 'TasksService::constructor()');
        }
    }

    async getTaskList(filterParams: ITaskFilterDetails): Promise<CustomError | ITask[]> {
        console.log('TaskService::getTaskList() filterParams: ', filterParams);
        try {
            let taskList: ITask[] = [];
            const querySnap = await this.taskCollectionRef.where('routeId', '==', filterParams.routeId).get();
            if(querySnap.docs.length > 0) {
                querySnap.docs.map((taskDoc: QueryDocumentSnapshot<DocumentData>) => {
                    taskList.push(taskDoc.data() as ITask);
                })
                console.log('TaskService::getTaskList() taskList: ', taskList);
                if(filterParams?.status) {
                    taskList = taskList.filter(task => task.status === filterParams.status);
                    console.log('TaskService::getTaskList() taskList filtered by status: ', taskList);
                }
                if(filterParams?.start) {
                    taskList = taskList.filter(task => task.start === filterParams.start);
                    console.log('TaskService::getTaskList() taskList filtered by start time: ', taskList);
                }
                if(filterParams?.end) {
                    taskList = taskList.filter(task => task.end === filterParams.end);
                    console.log('TaskService::getTaskList() taskList filtered by end time: ', taskList);
                }
                if(filterParams?.duration && TaskDuration.shortest) {
                    const shortest: ITask = taskList.reduce((prevTask, nextTask) => {
                        return prevTask.duration < nextTask.duration ? prevTask: nextTask;
                    });
                    taskList = [];
                    taskList.push(shortest);
                    console.log('TaskService::getTaskList() taskList filtered by shortest task duration: ', taskList);
                }
                if(filterParams?.duration && TaskDuration.longest) {
                    const longest: ITask = taskList.reduce((prevTask, nextTask) => {
                        return prevTask.duration > nextTask.duration ? prevTask : nextTask;
                    });
                    taskList = [];
                    taskList.push(longest);
                    console.log('TaskService::getTaskList() taskList filtered by longest task duration: ', taskList);
                }
            }
            console.log('Filled taskList: ', taskList);
            return taskList;
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'TaskService::getTaskList()');
        }
    }

    async getTasksByStatus(status: TaskStatus, tasks: ITask[]): Promise<ITask[] | CustomError> {
        console.log('TasksService::getTasksByStatus() status: ', TaskStatus[status]);
        try {
            let tasksByStatus: ITask[] = tasks.filter(task => task.status === status);
            return tasksByStatus;
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'TaskService::getTasksByStatus()');
        }
    }

    async getTaskById(id: string): Promise<CustomError | any> {
        console.log('TaskService::getTaskById() id: ', id);
        if(id != null && id != "") {
            try {
                let res: ITask | CustomError;
                const task = await (await this.taskCollectionRef.doc(id).get()).data();
                console.log('TaskService::getTaskById task: ', task);
                if(task === null || task === undefined) {
                    res = new CustomError('ClientError', 'Task with the given id doesnt exist!', 'TaskService::getTaskById()');
                }
                else {
                    res = (task as ITask);
                }
                return res;
            }
            catch(error) {
                return new CustomError(error.name, error.message, 'TaskService::getTaskById()');
            }
        }
    }

    async createTask(task: ICreateTask): Promise<CustomError | string> {
        console.log('TaskService::createTask() task: ', task);
        try {
            const docRef = await this.taskCollectionRef.add(task);
            return 'Task with the following id has been created: ' + docRef.id;
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'TaskService::createTask()');
        }
    }

    async updateTask(task: ITask): Promise<CustomError | WriteResult> {
        console.log('TasksService::updateTask() task: ', task);
        try {
            const docRef = this.taskCollectionRef.doc(task.id);
            const updateRes = await docRef.set(task);
            console.log('TasksService::updateTask() updateRes: ', updateRes);
            return updateRes;
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'TaskService::updateTask()');
        }
    }

    async deleteTask(id: string): Promise<CustomError | WriteResult> {
        console.log('TasksService::deleteTask() id: ', id);
        try {
            const taskDocRef = this.taskCollectionRef.doc(id);
            const deleteRes = await taskDocRef.delete();
            return deleteRes;
        }
        catch(error) {
            return new CustomError(error.name, error.message, 'TaskService::deleteTask()');
        }
    }
}