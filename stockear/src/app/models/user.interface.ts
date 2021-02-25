export type Roles = "admin" | "empleado";

export interface User {
    username: string;
    password: string;
    nombre:string;
    apellid:string;
}

export interface UserResponse {
    message: string;
    token: string;
    userId: number;
    role: Roles;
    adminId:number;
    nombre:string;
    apellido:string;
}
export interface UserData{
    username:string;
    id:number;
    rol:string;
}
