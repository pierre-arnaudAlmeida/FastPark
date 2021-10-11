import { Entity } from "./Entity";
import firebase from 'firebase/app';

export interface User extends Entity {
     id: string;
     email: string;
     password: string;
     username: string;
     firstName: string;
     lastName: string;
     role: string;
     position: firebase.firestore.GeoPoint;
     phoneNumber: string;
     creationDate: string;
     updateDate: string;
}