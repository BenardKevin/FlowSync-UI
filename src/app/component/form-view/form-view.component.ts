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
import { Supplier } from '../../model/supplier';
import { SupplierService } from '../../service/supplier/supplier.service';
import { AddressService } from '../../service/address/address.service';
import { Address } from '../../model/address';
import { DataService } from '../../service/data/data.service';

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
  suppliers: Supplier[] = [];
  addresses: Address[] = [];
  mainRoute!: string;

  data!: any;
  objectsData!: string[];

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
    private supplierService: SupplierService,
    private dataService: DataService,
    private addressService: AddressService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.mainRoute = this.router.url.split('/')[1];
    this.getIdFromRoute();
    console.log(this.id)

    if (this.id === 0) {
      let data: any;
    let service!: Observable<any>;

    switch (this.mainRoute) {
      case 'product':
        this.formViewTitle = 'Créer un nouveau produit :';
        data = { name: '', price: 0, vat: 0, category: '', supplier: '' };
        this.objectsData = ['category', 'supplier'];
        this.loadCategories();
        this.loadSuppliers();
        break;
      case 'contact':
        this.formViewTitle = 'Créer un nouveau contact :';
        data = { lastname: '', firstname: '', email: '' };
        this.objectsData = ['address'];
        this.loadAddresses();
        break;
      default: throw new Error('Error: Method implemented for route ' + this.mainRoute);
    }

    this.initForm(data);
    this.trackFormChanges();
    } else {
      this.modifyObject();
    }
  }

  private modifyObject() {
    let data: any;
    let service!: Observable<any>;

    switch (this.mainRoute) {
      case 'product':
        this.formViewTitle = 'Modifier le produit :';
        data = { name: '', price: 0, vat: 0, category: '', supplier: '' };
        service = this.productService.getProduct(this.id);
        this.objectsData = ['category', 'supplier'];
        this.loadCategories();
        this.loadSuppliers();
        break;
      case 'contact':
        this.formViewTitle = 'Modifier le contact :';
        data = { lastname: '', firstname: '', email: '' };
        service = this.contactService.getContact(this.id);
        this.objectsData = ['address'];
        this.loadAddresses();
        break;
      default: throw new Error('Error: Method implemented for route ' + this.mainRoute);
    }

    this.loadData(service);
    this.initForm(data);
    this.trackFormChanges();
  }

  private patchFormData(data: any) {

    switch(this.mainRoute) {
      case 'product':
        this.dataForm.patchValue({
          name: (data as Product).name,
          price: (data as Product).price,
          vat: (data as Product).vat,
          category: (data as Product).category?.name,
          supplier: (data as Product).supplier?.companyName
        });
        break;
      case 'contact':
        this.dataForm.patchValue({
          lastname: (data as Contact).lastname,
          firstname: (data as Contact).firstname,
          email: (data as Contact).email
        });
        break;
        default: throw new Error('Error: Method implemented for route ' + this.mainRoute);
    }
  }

  protected submitForm() {
    if (!this.dataForm.valid) return;


    switch(this.mainRoute) {
      case 'product':
        const payload = {
          name: this.dataForm.value.name,
          price: this.dataForm.value.price,
          vat: this.dataForm.value.vat,
          categoryId: this.categories.find(c => c.name === this.dataForm.value.category)?.id,
          supplierId: this.suppliers.find(s => s.companyName === this.dataForm.value.supplier)?.id,
        };

        const route = this.getMainRoute();
        if(this.id === 0) {
          this.dataService.createData(route, payload).subscribe({
            next: (response: any) => {
              console.log('Product creadted successfully:', response);
            },
            error: (error: any) => {
              console.error('Failed to create product:', error);
            }
          });
        } else {
          this.productService.updateProduct(this.id, payload).subscribe({
            next: () => {
              alert('Product updated successfully.');
            },
            error: (error) => {
              console.error('Failed to update product:', error.message);
            }
          });
        }
      break;
    case 'contact':
      const selectedAddress = this.addresses.find(c => c.streetName === this.dataForm.value.address);
      if (selectedAddress) this.data.address = selectedAddress;

      this.contactService.updateContact(this.id, this.data).subscribe({
        next: () => {
          console.log('Contact updated successfully');
        },
        error: (error) => {console.error('Failed to update contact:', error)}
      });
      break;
      default: throw new Error('Error: Method implemented for route ' + this.mainRoute);
    }
    this.goBack();
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
  
  private loadSuppliers() {
    this.supplierService.getSuppliers().pipe(take(1)).subscribe(supplier => this.suppliers = supplier);
  }

  private loadAddresses() {
    this.addressService.getAddresses().pipe(take(1)).subscribe(address => this.addresses = address);
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

  getMainRoute() {
    return this.router.url.split('/')[1];
  }
}
