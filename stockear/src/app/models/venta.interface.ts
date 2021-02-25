export interface VentaEmpleado {
    precio: number; 
    fechaVenta: Date; 
    user: User; 
    producto: Producto; 
    id: number;
}

export interface Producto{
    id:number;
    descripcion:string;
    costo:number;
    cantidad:number;
    minExistencia:number;
}

export interface User{
    
}