import { Entity } from "./Entity";

export interface User extends Entity {
     id: string;
     email: string;
     password: string;
     username: string;
     firstName: string;
     lastName: string;
     birthDay: string;
     phoneNumber: string;
     gender: string;
     role: string;
}