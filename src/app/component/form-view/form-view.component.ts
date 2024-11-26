import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../service/product/product.service';
import { CommonModule } from '@angular/common';

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
  title: string = 'Modifier le produit';
  submit: string = 'Mettre à jour';

  constructor(
    private productService: ProductService, 
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();
    this.getIdFromRoute();
    this.getProductById(this.id);
  }

  private getIdFromRoute() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = +params.get('id')!;
    });
  }

  private initForm() {
    this.productForm = new FormGroup({
      name: new FormControl(''),
      price: new FormControl(''),
      category: new FormControl('')
    });
  }

  private getProductById(id: number) {
    this.productService.getProductById(id).subscribe(product => {
      if (product) {
        this.productForm.patchValue({
          name: product.name || '',
          price: product.price || '',
          category: product.category?.name || ''
        });
      }
    }, error => {
      console.error('Failed to load product:', error);
    });
  }

  submitForm() {
    if (this.productForm.valid) {
      console.log(this.productForm.value);
    }
  }
}
