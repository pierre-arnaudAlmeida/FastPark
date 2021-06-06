import { Entity } from "./Entity";

export interface User extends Entity {
     id: string;
     email: string;
     password: string;
     username: string;
     firstName: string;
     lastName: string;
     role: string;
     //TODO Ajouter position avec un type geopoint
     //position: GeoPoint;
     phoneNumber: string;
     creationDate: string;
     updateDate: string;
}