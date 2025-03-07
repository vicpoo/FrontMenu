//orden.interface.ts
export interface DetalleOrden {
    id?: number; 
    orden_id?: number; 
    platillo_id: number;
    cantidad: number;
  }
  
  export interface Orden {
    id?: number; 
    mesa_id: number;
    estado: string;
    detalles: DetalleOrden[];
  }