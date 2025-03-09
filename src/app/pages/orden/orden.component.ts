//orden.component.ts
import { Component, OnInit } from '@angular/core';
import { PlatilloService } from '../../services/platillo.service';
import { MesaService } from '../../services/mesa.service';
import { OrdenService } from '../../services/orden.service';
import { Platillo } from '../../interfaces/platillo.interface';
import { Mesa } from '../../interfaces/mesa.interface';
import { Orden, DetalleOrden } from '../../interfaces/orden.interface';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [NavbarComponent, NgFor, FormsModule, NgIf],
  templateUrl: './orden.component.html',
})
export class OrdenComponent implements OnInit {
  platillos: Platillo[] = [];
  mesas: Mesa[] = [];
  orden: Orden = {
    mesa_id: 0,
    estado: 'pendiente', // Estado por defecto
    detalles: [],
  };
  mostrarConfirmacion: boolean = false;
  cantidadMap: Map<number, number> = new Map();

  constructor(
    private platilloService: PlatilloService,
    private mesaService: MesaService,
    private ordenService: OrdenService
  ) {}

  ngOnInit(): void {
    this.cargarPlatillos();
    this.cargarMesas();
  }

  cargarPlatillos(): void {
    this.platilloService.getPlatillos().subscribe(
      (data: Platillo[]) => {
        this.platillos = data;
      },
      (error) => {
        console.error('Error al cargar platillos:', error);
      }
    );
  }

  cargarMesas(): void {
    this.mesaService.getMesas().subscribe(
      (data: Mesa[]) => {
        this.mesas = data;
      },
      (error) => {
        console.error('Error al cargar mesas:', error);
      }
    );
  }

  agregarPlatillo(platilloId: number, cantidad: number): void {
    if (cantidad > 0) {
      const detalleExistente = this.orden.detalles.find(
        (d) => d.platillo_id === platilloId
      );
      if (detalleExistente) {
        detalleExistente.cantidad += cantidad;
      } else {
        const detalle: DetalleOrden = {
          platillo_id: platilloId,
          cantidad: cantidad,
        };
        this.orden.detalles.push(detalle);
      }
      this.cantidadMap.set(platilloId, 0); // Limpia la cantidad después de agregar
    }
  }

  confirmarOrden(): void {
    // Asegúrate de que el estado esté siempre presente
    this.orden.estado = 'pendiente';

    // Convierte mesa_id a número
    this.orden.mesa_id = Number(this.orden.mesa_id);

    // Depuración: Imprime el objeto orden antes de enviarlo
    console.log('Objeto orden que se enviará:', this.orden);
    console.log('Tipo de mesa_id:', typeof this.orden.mesa_id); // Verifica el tipo de mesa_id

    if (this.orden.mesa_id && this.orden.detalles.length > 0) {
      this.ordenService.createOrden(this.orden).subscribe(
        (response) => {
          this.mostrarConfirmacion = true;
          this.limpiarOrden(); // Limpia la orden después de confirmar
        },
        (error) => {
          console.error('Error al crear la orden:', error);
          console.error('Detalles del error:', error.error); // Muestra los detalles del error
        }
      );
    } else {
      alert('Selecciona una mesa y al menos un platillo.');
    }
  }

  limpiarOrden(): void {
    // Reinicia el objeto orden con el estado por defecto
    this.orden = {
      mesa_id: 0,
      estado: 'pendiente',
      detalles: [],
    };
    this.cantidadMap.clear();
  }

  calcularTotal(): number {
    return this.orden.detalles.reduce((total, detalle) => {
      const platillo = this.platillos.find((p) => p.id === detalle.platillo_id);
      return total + (platillo?.precio || 0) * detalle.cantidad;
    }, 0);
  }

  obtenerNombrePlatillo(platilloId: number): string {
    const platillo = this.platillos.find((p) => p.id === platilloId);
    return platillo ? platillo.nombre : 'Platillo no encontrado';
  }

  obtenerPrecioPlatillo(platilloId: number): number {
    const platillo = this.platillos.find((p) => p.id === platilloId);
    return platillo ? platillo.precio : 0;
  }

  obtenerCantidad(platilloId: number): number {
    return this.cantidadMap.get(platilloId) || 0;
  }

  actualizarCantidad(platilloId: number, cantidad: number): void {
    this.cantidadMap.set(platilloId, cantidad);
  }
}