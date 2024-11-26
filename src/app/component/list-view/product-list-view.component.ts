import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LIST_CONFIG } from './list-view.config';
import { BaseListViewComponent } from './base-list-view.component';
import { Product } from '../../model/product';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-list-view',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss',
  providers: [{
        provide: LIST_CONFIG,
        useValue: {
            pageSize: 10,
            sortable: true,
            filterable: true,
            columns: [
                { key: 'name', label: 'Nom', sortable: true, filterable: true },
                { key: 'price', label: 'Prix', sortable: true },
                { key: 'category', label: 'Catégorie', sortable: true, filterable: true },
            ],
            actions: {
                edit: true,
                delete: true,
                view: true
            }
        }
    }]
})
export class ProductListViewComponent extends BaseListViewComponent<Product> {
    private productService: ProductService = inject(ProductService);

    ngOnInit(): void {
        this.loadProducts();
    }

    private loadProducts() {
        this.productService.getProducts().subscribe(
            products => {
                this.items = products;
            }
        );
    }

    getItemValue(item: Product, key: string): any {
        return item[key as keyof Product];
    }
}