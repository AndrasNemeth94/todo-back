const createUserProps = [ 'id','username', 'firstName', 'lastName', 'email','profileimg', 'password', 'permissions', 'timezone', 'securityQuestion', 'answer'];

const createTaskProps = [ 'name', 'status', 'duration', 'start', 'end'];

const createRouteProps = [ 'name', 'duration', 'category', 'platformZeroId', 'finalDestinationId', 'duration', 'tasks', 'status', 'userId'];

export enum ObjType {

    USER_CREATE = 'UserCreate',
    USER_UPDATE = 'UserUpdate',

    TASK_CREATE = 'TaskCreate',
    TASK_UPDATE = 'TaskUpdate',

    ROUTE_CREATE = 'RouteCreate',
    ROUTE_UPDATE = 'RouteUpdate'
}


export function checkObjProperties(obj: any, type: ObjType): string[] | boolean {
    console.log('TypeChecker::checkCreateTask() obj: ', obj, ', type: ', type);
    let missingProps = [];
    const objKeys = Object.keys(obj);
    console.log('OBJ keys: ', objKeys.sort(), ' taskProps: ', createTaskProps.sort());
    const arrayToCheck = setPropertyArray(type);

    arrayToCheck.forEach(el => {
        const hasKey = objKeys.find(prop => el === prop);
        if(hasKey === undefined || hasKey === "" || hasKey !== null) {
            missingProps.push(el);
        }
    })
    console.log('MISIINGPROPS: ', missingProps);
    return missingProps.length > 0 ? missingProps: true;
}

function setPropertyArray(type: ObjType): string[] {
    console.log('TypeGuard::setPropertyArray() type: ', ObjType[type]);
    let arrayToCheck = [];
    switch(type) {
        case ObjType.USER_CREATE:
            arrayToCheck = createUserProps;
            break;
        case ObjType.USER_UPDATE:
            // const pwIndex = createUserProps.indexOf('password');
            // let updateUserArr = createRouteProps.splice(pwIndex, 1);
            // updateUserArr.push('id');
            // console.log('MODIFYED updateUserARR: ', updateUserArr);
            arrayToCheck = createUserProps;
            break;
        case ObjType.TASK_CREATE || ObjType.TASK_UPDATE:
            arrayToCheck = createTaskProps;
            break;
        case ObjType.ROUTE_CREATE || ObjType.ROUTE_UPDATE:
            arrayToCheck = createRouteProps
            break;
    }
    console.log('TypeGuard::setPropertyArray() arrayToCheck: ', arrayToCheck);
    return arrayToCheck;
}