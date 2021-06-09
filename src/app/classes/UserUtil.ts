import { DocumentChangeAction, DocumentSnapshot } from '@angular/fire/firestore';
import { User } from '../shared/User';
import { property } from "../app.property";

export class UserUtil {

    /* Noms des collections firebase avec pour : 
     *  - nom de propriété : nom de l'entité en minuscule suivit de 'CollectionName'
     *  - valeur : nom de la collection sur Firebase 
     */
    static userCollectionName: string = property.collectionName.users;


    /**
     * Map une collection de type any en fonction du nom de l'entité
     * 
     * @param e 
     * @param entityName 
     */
    static mapCollection<T>(data: DocumentChangeAction<T>[], entityName: string): any[] {
        let records: any = [];
        if (entityName == this.userCollectionName) {
            data.forEach(e => {
                const record = {
                    id: e.payload.doc.id,
                    email: e.payload.doc.data()['email'],
                    password: e.payload.doc.data()['password'],
                    username: e.payload.doc.data()['username'],
                    firstName: e.payload.doc.data()['firstName'],
                    lastName: e.payload.doc.data()['lastName'],
                    role: e.payload.doc.data()['role'],
                    //TODO Ajouter position avec un type geopoint
                    phoneNumber: e.payload.doc.data()['phoneNumber'],
                    creationDate: new Date(e.payload.doc.data()['creationDate']).toISOString(),
                    updateDate: new Date(e.payload.doc.data()['updateDate']).toISOString(),
                }
                records.push(record);
            });
            return records;
        }
        throw new Error("The collection map of the entity " + entityName + " does not exist");

    }

    /**
     * Map un élément de type any en fonction de son entité
     * 
     * @param payload
     * @param entityName 
     */
    static mapItem<T>(payload: DocumentSnapshot<{}>, entityName: string): any {
        if (entityName == this.userCollectionName) {
            return {
                id: payload.id,
                email: payload.get('email'),
                password: payload.get('password'),
                username: payload.get('username'),
                firstName: payload.get('firstName'),
                lastName: payload.get('lastName'),
                role: payload.get('role'),
                //TODO Ajouter position avec un type geopoint
                phoneNumber: payload.get('phoneNumber'),
                creationDate: new Date(payload.get('creationDate')).toISOString(),
                updateDate: new Date(payload.get('updateDate')).toISOString(),
            }
        }
        throw new Error("The map of the entity name " + entityName + " does not exist");
    }

    static getEmptyUser(): User {
        return {
            id: "",
            email: "",
            password: "",
            username: "",
            firstName: "",
            lastName: "",
            role: "",
            //position: null,
            phoneNumber: "",
            creationDate: new Date().toISOString(),
            updateDate: new Date().toISOString(),   
        }
    }

}