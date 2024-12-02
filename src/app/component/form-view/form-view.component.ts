import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../service/product/product.service';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../service/category/category.service';
import { Category } from '../../model/category';
import { Product } from '../../model/product';
import { ContactService } from '../../service/contact/contact.service';
import { Contact } from '../../model/contact';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-form-view',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-view.component.html',
  styleUrl: './form-view.component.scss'
})

export class FormViewComponent implements OnInit {
  id!: number;
  dataForm!: FormGroup;
  categories: Category[] = [];
  mainRoute!: string;

  data!: any;
  productObjects!: string[];

  selectedCategory: string = '';
  dropdownOpen: boolean = false;

  formViewTitle!: string;
  formViewSubmit: string = 'Mettre à jour';
  formViewReturn: string = 'Retour';

  keepOrder = (): number => 0;

  constructor(
    private productService: ProductService,
    private contactService: ContactService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.mainRoute = this.router.url.split('/')[1];
    this.getIdFromRoute();


    let data: any;
    let service!: Observable<any>;
    this.formViewTitle = 'Modifier le ' + this.mainRoute;

    switch(this.mainRoute) {
      case 'product':
        data = { name: '', price: 0, category: '' };
        service = this.productService.getProduct(this.id);
        this.productObjects = ['category'];
        this.loadCategories()
        break;
      case 'contact':
        data = { name: '', firstname: '', email: '', address: '' };
        service = this.contactService.getContact(this.id);
        break;
        default: throw new Error('Error: Method implemented for route ' + this.mainRoute);
    }

    this.initForm(data);
    this.loadData(service);
    this.trackFormChanges();
  }

  private patchFormData(data: any) {

    switch(this.mainRoute) {
      case 'product':
        this.dataForm.patchValue({
          name: (data as Product).name,
          price: (data as Product).price,
          category: (data as Product).category?.name
        });
        break;
      case 'contact':
        this.dataForm.patchValue({
          name: (data as Contact).name,
          firstname: (data as Contact).firstname,
          email: (data as Contact).email,
          address: (data as Contact).address
        });
        break;
        default: throw new Error('Error: Method implemented for route ' + this.mainRoute);
    }
  }

  protected submitForm() {
    if (!this.dataForm.valid) return;


    switch(this.mainRoute) {
      case 'product':
      const selectedCategory = this.categories.find(c => c.name === this.dataForm.value.category);
      if (selectedCategory) this.data.category = selectedCategory;

      this.productService.updateProduct(this.id, this.data).subscribe({
        next: () => {
          console.log('Product updated successfully');
          this.goBack();
        },
        error: error => console.error('Failed to update contact:', error)
      });
      break;
    case 'contact':
      this.contactService.updateContact(this.id, this.data).subscribe({
        next: () => {
          console.log('Contact updated successfully');
          this.goBack();
        },
        error: error => console.error('Failed to update contact:', error)
      });
      break;
      default: throw new Error('Error: Method implemented for route ' + this.mainRoute);
    }
  }

  ///////////////////////////////////////////////////

  private initForm(data: any) {

    const formGroup: { [key: string]: FormControl } = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formGroup[key] = new FormControl(
          data[key] || '',
          this.getValidators(data[key])
        );
      }
    }

    this.dataForm = new FormGroup(formGroup);
  }

  private loadData(service: Observable<any>) {
    service.pipe(take(1)).subscribe(data => this.patchFormData(data));
  }

  private getValidators(value: any): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    validators.push(Validators.required);

    if (typeof value === 'number') validators.push(Validators.min(0));
    if (typeof value === 'string' && value.length > 0) validators.push(Validators.minLength(1));

    return validators;
  }

  private loadCategories() {
    this.categoryService.getCategories().pipe(take(1)).subscribe(category => this.categories = category);
  }

  private getIdFromRoute() {
    this.activatedRoute.paramMap.subscribe(params => this.id = +params.get('id')!);
  }

  private trackFormChanges() {
    this.dataForm.valueChanges.subscribe(values => this.data = { ...this.data, ...values });
  }

  protected goBack() {
    this.router.navigate([`/${this.mainRoute}/list-view`]);
  }
}
