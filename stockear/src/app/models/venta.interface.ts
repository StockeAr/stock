export interface Venta{
    id:number;
    fechaVenta:Date;
    total:number;    
}

export interface VentaDetalle{
    ventaId:number;
    producto:string;
    categoria:string;
    costo:number;
    cantidad:number;
    totalParcial:number;
}