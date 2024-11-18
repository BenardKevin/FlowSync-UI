import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-list-view',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss'
})

export class ListViewComponent {
  faPen = faPen;
  faTrash = faTrash;
  data: any;
  keys: string[] = [];
  filters: string[] = [];

  constructor(
    private router: Router,
    private productService: ProductService) {
      
    this.addFilters(["id", "available"]);
      
    this.router.events.subscribe(() => {
      this.getData();
    });
  }

  getData() {
    this.productService.getProducts().subscribe(data => {
      this.data = data;
      
      this.keys = this.getKeys(this.data);
      this.keys = this.keys.filter( (columnName: string) => !this.filters.includes(columnName));
    });
  }

  getKeys(array: string[]) {
    return (array && array.length > 0) ? Object.keys(array[0]) : [];
  }

  addFilter(value: string) {
    this.filters.push(value);
  }

  addFilters(value: string[]) {
    this.filters.push(...value);
  }

  removeFilter(value: string) {
    this.filters.filter( (element: string) => value == element);
  }

  removeFilters(value: string[]) {
    this.filters.filter( (element: string) => !value.includes(element));
  }
}
