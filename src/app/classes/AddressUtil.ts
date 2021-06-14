import { DocumentChangeAction, DocumentSnapshot } from '@angular/fire/firestore';
import { Address } from '../shared/Address';
import { property } from "../app.property";
import firebase from 'firebase/app';

export class AddressUtil {

    /* Noms des collections firebase avec pour : 
     *  - nom de propriété : nom de l'entité en minuscule suivit de 'CollectionName'
     *  - valeur : nom de la collection sur Firebase 
     */
    static addressCollectionName: string = property.collectionName.addresses;


    /**
     * Map une collection de type any en fonction du nom de l'entité
     * 
     * @param e 
     * @param entityName 
     */
    static mapCollection<T>(data: DocumentChangeAction<T>[], entityName: string): any[] {
        let records: any = [];
        if (entityName == this.addressCollectionName) {
            data.forEach(e => {
                const record = {
                    id: e.payload.doc.id,
                    street_number: e.payload.doc.data()['street_number'],
                    street_name: e.payload.doc.data()['street_name'],
                    city: e.payload.doc.data()['city'],
                    postal_code: e.payload.doc.data()['postal_code'],
                    country: e.payload.doc.data()['country'],
                    position: e.payload.doc.data()['position'],
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
        if (entityName == this.addressCollectionName) {
            return {
                id: payload.id,
                street_number: payload.get('street_number'),
                street_name: payload.get('street_name'),
                city: payload.get('city'),
                postal_code: payload.get('postal_code'),
                country: payload.get('country'),
                position: payload.get('position'),
                creationDate: new Date(payload.get('creationDate')),
                updateDate: new Date(payload.get('updateDate')),
            }
        }
        throw new Error("The map of the entity name " + entityName + " does not exist");
    }

    static getEmptyAddress(): Address {
        return {
            id: "",
            street_number: 0,
            street_name: "",
            city: "",
            postal_code: "",
            country: "",
            position: new firebase.firestore.GeoPoint(0,0),
            creationDate: new Date().toISOString(),
            updateDate: new Date().toISOString(),   
        }
    }

}