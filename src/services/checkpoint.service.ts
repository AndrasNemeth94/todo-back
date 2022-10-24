// import { CollectionReference, Firestore } from "firebase-admin/firestore";
// import { CustomError } from "../models/custorm-error";

// export class CheckPointService {

//     private checkPointCollectionRef: CollectionReference;

//     constructor(db: Firestore) {
//         try {
//             this.checkPointCollectionRef = db.collection('checkpoints');
//         }
//         catch(error) {
//             throw new CustomError(error.name, error.message, 'CheckPointService::constructor()');
//         }
//     }

//     async createCheckPoint(checkPoint: any): Promise<CustomError | any> {

//     }

//     async getCheckPointById(id: string): Promise<CustomError | any> {

//     }

//     async updateCheckPoint(checkPoint: any): Promise<CustomError | any> {

//     }

//     async deleteCheckPoint(id: string): Promise<CustomError | any> {

//     }
// }