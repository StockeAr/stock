export interface Venta {
    id: number;
    fechaVenta: Date;
    total: number;
}

export interface VentaDetalle {
    ventaId: number;
    producto: any;
    precio: number;
    cantidad: number;
    totalParcial: number;
}
