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
  imports: [NavbarComponent, NgFor, FormsModule, NgIf], // Importa módulos necesarios
  templateUrl: './orden.component.html',
})
export class OrdenComponent implements OnInit {
  platillos: Platillo[] = []; // Lista de platillos disponibles
  mesas: Mesa[] = []; // Lista de mesas disponibles
  orden: Orden = {
    mesa_id: 0,
    estado: 'pendiente',
    detalles: [],
  };
  mostrarConfirmacion: boolean = false; // Controla la visibilidad del resumen de la orden
  cantidadMap: Map<number, number> = new Map(); // Mapa para almacenar la cantidad de cada platillo

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
      const detalle: DetalleOrden = {
        platillo_id: platilloId,
        cantidad: cantidad,
      };
      this.orden.detalles.push(detalle);
      this.cantidadMap.set(platilloId, 0); // Limpia la cantidad después de agregar
    }
  }

  confirmarOrden(): void {
    if (this.orden.mesa_id && this.orden.detalles.length > 0) {
      this.ordenService.createOrden(this.orden).subscribe(
        (response) => {
          this.mostrarConfirmacion = true; // Muestra el resumen de la orden
        },
        (error) => {
          console.error('Error al crear la orden:', error);
        }
      );
    } else {
      alert('Selecciona una mesa y al menos un platillo.');
    }
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

  // Método para obtener la cantidad de un platillo desde el mapa
  obtenerCantidad(platilloId: number): number {
    return this.cantidadMap.get(platilloId) || 0;
  }

  // Método para actualizar la cantidad de un platillo en el mapa
  actualizarCantidad(platilloId: number, cantidad: number): void {
    this.cantidadMap.set(platilloId, cantidad);
  }
}