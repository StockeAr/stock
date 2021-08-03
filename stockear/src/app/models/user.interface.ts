export type Roles = "admin" | "empleado";

export interface User {
    username: string;
    password: string;
    nombre: string;
    apellido: string;
}

export interface UserResponse {
    message: string;
    token: string;
    userId: number;
    role: Roles;
    adminId: number;
    nombre: string;
    apellido: string;
    perfil: string;
    email: string;
    negocio?: string;
}
export interface UserData {
    username: string;
    id: number;
    rol: string;
    modificado?: Date;
    activo:boolean;
}
