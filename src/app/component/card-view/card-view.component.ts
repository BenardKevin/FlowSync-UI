import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductService } from '../../service/product.service';
import { faBan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-card-view',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './card-view.component.html',
  styleUrl: './card-view.component.scss'
})
export class CardViewComponent implements OnInit {
  faBan = faBan;
  products: any;

  constructor(private productService: ProductService) { }
  
  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }
}
