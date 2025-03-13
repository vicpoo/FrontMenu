//admin.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrdenService } from '../../services/orden.service';
import { MesaService } from '../../services/mesa.service';
import { PlatilloService } from '../../services/platillo.service';
import { OrdenSegundaApiService } from '../../services/orden-segunda-api.service'; // Nuevo servicio
import { Orden, OrdenSegundaApi } from '../../interfaces/orden.interface'; // Interfaces
import { Mesa } from '../../interfaces/mesa.interface';
import { Platillo } from '../../interfaces/platillo.interface';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  ordenes: OrdenSegundaApi[] = []; // Usamos la interfaz de la segunda API
  mesas: Mesa[] = [];
  platillos: Platillo[] = [];

  // Variables para controlar la visibilidad de las secciones
  showPedidos: boolean = true;
  showMesasSection: boolean = false;
  showPlatillosSection: boolean = false;

  // Variables para controlar la visibilidad de los modales
  showMesaModal: boolean = false;
  showPlatilloModal: boolean = false;
  showEstadoModal: boolean = false;

  // Variables para controlar si se está editando o agregando
  isEditingMesa: boolean = false;
  isEditingPlatillo: boolean = false;

  // Formularios para mesas y platillos
  mesaForm: Mesa = { numero_mesa: 0 };
  platilloForm: Platillo = { nombre: '', descripcion: '', precio: 0 };

  // Variables para el estado de los pedidos
  selectedEstado: string = '';
  selectedOrden: OrdenSegundaApi | null = null; // Usamos la interfaz de la segunda API

  constructor(
    private router: Router,
    private ordenService: OrdenService,
    private ordenSegundaApiService: OrdenSegundaApiService, // Inyectamos el nuevo servicio
    private mesaService: MesaService,
    private platilloService: PlatilloService
  ) {}

  ngOnInit(): void {
    this.loadOrdenes(); // Cargar órdenes de la segunda API
    this.loadMesas();
    this.loadPlatillos();
  }

  // Cargar todas las órdenes de la segunda API
  loadOrdenes(): void {
    this.ordenSegundaApiService.getOrdenes().subscribe((data) => {
      console.log('Órdenes obtenidas de la API:', data);
      this.ordenes = data.filter((orden) => orden.estado.toLowerCase() !== 'cancelada');
      console.log('Órdenes filtradas:', this.ordenes);
    });
  }


  // Cargar todas las mesas
  loadMesas(): void {
    this.mesaService.getMesas().subscribe((data) => {
      this.mesas = data;
    });
  }

  // Cargar todos los platillos
  loadPlatillos(): void {
    this.platilloService.getPlatillos().subscribe((data) => {
      this.platillos = data;
    });
  }

  // Mostrar sección de Mesas
  showMesas(): void {
    this.showPedidos = false;
    this.showMesasSection = true;
    this.showPlatillosSection = false;
  }

  // Mostrar sección de Platillos
  showPlatillos(): void {
    this.showPedidos = false;
    this.showMesasSection = false;
    this.showPlatillosSection = true;
  }

  // Abrir modal para Mesas
  openMesaModal(mesa?: Mesa): void {
    this.isEditingMesa = !!mesa;
    this.mesaForm = mesa ? { ...mesa } : { numero_mesa: 0 };
    this.showMesaModal = true;
  }

  // Cerrar modal para Mesas
  closeMesaModal(): void {
    this.showMesaModal = false;
    this.mesaForm = { numero_mesa: 0 };
  }

  // Guardar o actualizar una mesa
  saveMesa(): void {
    if (this.isEditingMesa && this.mesaForm.id) {
      this.mesaService.updateMesa(this.mesaForm.id, this.mesaForm).subscribe(() => {
        this.loadMesas();
        this.closeMesaModal();
      });
    } else {
      this.mesaService.createMesa(this.mesaForm).subscribe(() => {
        this.loadMesas();
        this.closeMesaModal();
      });
    }
  }

  // Eliminar una mesa
  deleteMesa(id?: number): void {
    if (id) {
      this.mesaService.deleteMesa(id).subscribe(() => {
        this.loadMesas();
      });
    }
  }

  // Abrir modal para Platillos
  openPlatilloModal(platillo?: Platillo): void {
    this.isEditingPlatillo = !!platillo;
    this.platilloForm = platillo ? { ...platillo } : { nombre: '', descripcion: '', precio: 0 };
    this.showPlatilloModal = true;
  }

  // Cerrar modal para Platillos
  closePlatilloModal(): void {
    this.showPlatilloModal = false;
    this.platilloForm = { nombre: '', descripcion: '', precio: 0 };
  }

  // Guardar o actualizar un platillo
  savePlatillo(): void {
    if (this.isEditingPlatillo && this.platilloForm.id) {
      this.platilloService.updatePlatillo(this.platilloForm.id, this.platilloForm).subscribe(() => {
        this.loadPlatillos();
        this.closePlatilloModal();
      });
    } else {
      this.platilloService.createPlatillo(this.platilloForm).subscribe(() => {
        this.loadPlatillos();
        this.closePlatilloModal();
      });
    }
  }

  // Eliminar un platillo
  deletePlatillo(id?: number): void {
    if (id) {
      this.platilloService.deletePlatillo(id).subscribe(() => {
        this.loadPlatillos();
      });
    }
  }

  // Abrir modal para actualizar el estado de un pedido
  openEstadoModal(orden: OrdenSegundaApi): void {
    this.selectedOrden = orden;
    this.selectedEstado = orden.estado;
    this.showEstadoModal = true;
  }

  // Cerrar modal para actualizar el estado de un pedido
  closeEstadoModal(): void {
    this.showEstadoModal = false;
    this.selectedOrden = null;
    this.selectedEstado = '';
  }

  // Actualizar el estado de un pedido
  updateEstado(): void {
    if (this.selectedOrden && this.selectedOrden.id) {
      const nuevoEstado = { estado: this.selectedEstado };
      this.ordenSegundaApiService.updateEstadoOrden(this.selectedOrden.id, nuevoEstado).subscribe(() => {
        this.loadOrdenes(); // Recargar las órdenes después de actualizar
        this.closeEstadoModal();
      });
    }
  }

  // Navegar a la vista de inicio
  goToHome(): void {
    this.router.navigate(['/']);
  }
}