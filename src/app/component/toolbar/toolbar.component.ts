import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faPlus, faCircleArrowUp, faCircleArrowDown, faGrip, faList } from '@fortawesome/free-solid-svg-icons';
import { UserPreferencesService } from '../../service/user-preferences.service';
import * as XLSX from 'xlsx';
import { ProductService } from '../../service/product/product.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'toolbar',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  faPlus: IconDefinition = faPlus;
  faCircleArrowUp: IconDefinition = faCircleArrowUp;
  faCircleArrowDown: IconDefinition = faCircleArrowDown;
  faGrip: IconDefinition = faGrip;
  faList: IconDefinition = faList;

  listView!: boolean;
  selectedFileFormat!: string;
  dropdownOpen: boolean = false;

  export: string = "Export";
  toolbarXlsx: string = "Excel (.xlsx)";
  toolbarCsv: string = "CSV (.csv)";

  leftButtons = [
    { icon: this.faPlus, label: 'Create new object', class: 'object-creator', action: () => this.createObject() },
    { icon: this.faCircleArrowUp, label: 'Import', class: 'object-import', action: () => this.importObject() },
    { icon: this.faCircleArrowDown, label: 'Export', class: 'object-export', action: () => this.toggleDropdown() }
  ];

  rightButtons = [
    { icon: this.faGrip, label: 'Display card view', condition: () => this.listView, action: () => this.changeView() },
    { icon: this.faList, label: 'Display list view',  condition: () => !this.listView, action: () => this.changeView() }
  ];

  constructor(private productService: ProductService, private userPrefService: UserPreferencesService, private router: Router) { }
  
  getMainRoute() {
    return this.router.url.split('/')[1];
  }

  changeView() {
    const mainRoute = this.getMainRoute();
    if (mainRoute !== "product") return;

    this.listView = this.userPrefService.toggleView();
    const newViewType = this.listView ? 'card-view' : 'list-view';

    this.router.navigate([`/${mainRoute}/${newViewType}`]);
  }

  createObject() {
    throw new Error('Method not implemented.');
  }

  importObject() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls, .csv';

    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        jsonData.forEach((importedProduct: any) => {
          const formattedProduct = this.transformProductData(importedProduct);

          this.productService.importProduct(formattedProduct).subscribe({
            next: (response) => {
              console.log('Product imported successfully:', response);
            },
            error: (error) => {
              console.error('Failed to import product:', error);
            }
          });
        });
      };

      reader.readAsArrayBuffer(file);
    });

    input.click();
  }

  private transformProductData(productData: any) {
    return {
      id: productData.id,
      name: productData.name,
      price: productData.price,
      category_id: productData.category_id
    }
  }
  
  exportObject() {
    const actualRoute = this.router.url.split('/')[1];
  
    if (actualRoute === "product") {
      this.exportProductData();
    } else {
      this.exportTableData();
    }
  }

  private exportProductData() {
    this.productService.getProducts().pipe(
      catchError((error) => {
        console.error('Failed to fetch product data:', error);
        return throwError(() => error);
      })
    ).subscribe((products) => {
      if (products && products.length > 0) {
        const transformedProducts = products.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          category_id: product.category.id  // Extract category_id
        }));
  
        // Convert transformed data to a worksheet
        const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(transformedProducts);
        this.exportToFile(workSheet, 'ProductData');
      } else {
        console.warn('No product data available to export.');
      }
    });
  }
  
  private exportTableData() {
    const table = document.getElementById('table') as HTMLTableElement;
  
    if (table) {
      const workSheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
      this.exportToFile(workSheet, 'TableData');
    } else {
      console.error('Table element not found. Cannot export data.');
    }
  }

  private exportToFile(workSheet: XLSX.WorkSheet, baseFileName: string) {
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet1');

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  
    const dateTime = `${formattedDate}_${hours}-${minutes}-${seconds}`;
    const fileName = `${baseFileName}_${dateTime}.${this.selectedFileFormat}`;

    if (this.selectedFileFormat === 'csv') {
      const csvOutput = XLSX.utils.sheet_to_csv(workSheet);
      const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
      this.saveBlob(blob, fileName);

    } else {
      XLSX.writeFile(workBook, fileName);
    }
  }

  private saveBlob(blob: Blob, fileName: string) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  selectFileFormat(format: string) {
    this.selectedFileFormat = format;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  openDropdown() {
    this.dropdownOpen = true;
  }
}
