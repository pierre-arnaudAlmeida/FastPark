import { Entity } from "./Entity";
import firebase from 'firebase/app';

export interface Address extends Entity {
    id: string;
    street_number: number;
    street_name: string;
    city: string;
    postal_code: string;
    country: string;
    position: firebase.firestore.GeoPoint;
    creationDate: string;
    updateDate: string;
}