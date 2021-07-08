export interface Categoria {
    id?: number;
    descripcion: string;
}

export interface Medida {
    id?: number;
    descripcion: string;
}

export interface Producto {
    id: number;
    descripcion: string;
    costo: number;
    cantidad: number;
    minExistencia: number;
    categoria?: Categoria;
    imagen?: string;
    medida?: Medida;
}