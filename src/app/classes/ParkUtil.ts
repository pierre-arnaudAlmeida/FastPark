import { DocumentChangeAction, DocumentSnapshot } from '@angular/fire/firestore';
import { Park } from '../shared/Park';
import { property } from "../app.property";

export class ParkUtil {

    /* Noms des collections firebase avec pour : 
     *  - nom de propriété : nom de l'entité en minuscule suivit de 'CollectionName'
     *  - valeur : nom de la collection sur Firebase 
     */
    static parkCollectionName: string = property.collectionName.parks;


    /**
     * Map une collection de type any en fonction du nom de l'entité
     * 
     * @param e 
     * @param entityName 
     */
    static mapCollection<T>(data: DocumentChangeAction<T>[], entityName: string): any[] {
        let records: any = [];
        if (entityName == this.parkCollectionName) {
            data.forEach(e => {
                const record = {
                    id: e.payload.doc.id,
                    name: e.payload.doc.data()['name'],
                    addressId: e.payload.doc.data()['addressId'],
                    managerId: e.payload.doc.data()['managerId'],
                    phoneNumber: e.payload.doc.data()['phoneNumber'],
                    freePlaces: e.payload.doc.data()['freePlaces'],
                    totalPlaces: e.payload.doc.data()['totalPlaces'],
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
        if (entityName == this.parkCollectionName) {
            return {
                id: payload.id,
                name: payload.get('name'),
                addressId: payload.get('addressId'),
                managerId: payload.get('managerId'),
                phoneNumber: payload.get('phoneNumber'),
                freePlaces: payload.get('freePlaces'),
                totalPlaces: payload.get('totalPlaces'),
                creationDate: new Date(payload.get('creationDate')).toISOString(),
                updateDate: new Date(payload.get('updateDate')).toISOString(),
            }
        }
        throw new Error("The map of the entity name " + entityName + " does not exist");
    }

    static getEmptyPark(): Park {
        return {
            id: "",
            name: "",
            addressId: "",
            managerId: "",
            phoneNumber: "",
            freePlaces: null,
            totalPlaces: null,
            creationDate: new Date().toISOString(),
            updateDate: new Date().toISOString(),   
        }
    }

}