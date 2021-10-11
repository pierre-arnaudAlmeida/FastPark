import { Entity } from "./Entity";

export interface Park extends Entity {
     id: string;
     name: string;
     addressId: string;
     managerId: string;
     phoneNumber: string;
     freePlaces: number;
     totalPlaces: number;
     creationDate: string;
     updateDate: string;
}