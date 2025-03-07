import { Component, OnInit } from '@angular/core';
import { PlatilloService } from '../../services/platillo.service';
import { Platillo } from '../../interfaces/platillo.interface';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-menu',
  standalone: true, // Habilita el modo standalone
  imports: [CommonModule, HttpClientModule, NavbarComponent], // Importa módulos necesarios
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  platillos: Platillo[] = []; // Arreglo para almacenar los platillos

  constructor(private platilloService: PlatilloService) {}

  ngOnInit(): void {
    this.obtenerPlatillos(); // Llama a la función para obtener los platillos al iniciar el componente
  }

  obtenerPlatillos(): void {
    this.platilloService.getPlatillos().subscribe(
      (data: Platillo[]) => {
        this.platillos = data; // Asigna los platillos obtenidos al arreglo
      },
      (error) => {
        console.error('Error al obtener los platillos:', error);
      }
    );
  }
}