import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../service/product/product.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../service/category/category.service';
import { Category } from '../../model/category';

@Component({
  selector: 'app-form-view',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-view.component.html',
  styleUrl: './form-view.component.scss'
})

export class FormViewComponent implements OnInit {
  id!: number;
  productForm!: FormGroup;
  product!: any;
  category: Category[] = [];

  formViewTitle: string = 'Modifier le produit';
  formViewSubmit: string = 'Mettre à jour';
  formViewReturn: string = 'Retour';

  constructor(
    private productService: ProductService, 
    private categoryService: CategoryService, 
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.getIdFromRoute();
    this.getProductById();
    this.getCategories();
    this.trackFormChanges();
  }

  protected submitForm() {
    if (!this.productForm.valid) return;

    this.product.category = this.category.find(c => c.name === this.productForm.value.category);

    this.productService.updateProductById(this.id, this.product).subscribe({
      next: response => {
        console.log(response.message || 'Update successful');
        this.goBack();
      },
      error: error => {
        console.error('Failed to update product:', error);
      }
    });
  }

  private initForm() {
    this.productForm = new FormGroup({
      name: new FormControl(''),
      price: new FormControl(''),
      category: new FormControl('')
    });
  }

  private getIdFromRoute() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = +params.get('id')!;
    });
  }

  private getCategories() {
    this.categoryService.getCategories().subscribe(category => {
      this.category = category;
    });
  }

  private getProductById() {
    this.productService.getProductById(this.id).subscribe(product => {
      this.product = product;
      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        category: product.category?.name
      });
    });
  }

  private trackFormChanges() {
    this.productForm.valueChanges.subscribe((values) => {
      this.product = { ...this.product, ...values };
    });
  }

  protected goBack() {
    const mainRoute = this.router.url.split('/')[1];
    const newViewType = 'list-view';

    this.router.navigate([`/${mainRoute}/${newViewType}`]);
  }
}
