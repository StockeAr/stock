export type Roles = "ADMIN" | "READER";

export interface User {
    username: string;
    password: string;
}

export interface UserResponse {
    message: string;
    token: string;
    userId: number;
    role: Roles;
}
export interface UserData{
    username:string;
    id:number;
    rol:string;
}
