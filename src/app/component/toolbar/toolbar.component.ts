import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faPlus, faCircleArrowUp, faCircleArrowDown, faGrip, faList } from '@fortawesome/free-solid-svg-icons';
import { UserPreferencesService } from '../../service/user-preferences.service';
import * as XLSX from 'xlsx';
import { ProductService } from '../../service/product.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'toolbar',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule, FormsModule],
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
  selectedFileFormat: string = 'xlsx';
  dropdownOpen: boolean = false;

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
    throw new Error('Method not implemented.');
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
        const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(products);
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

    const fileName = `${baseFileName}.${this.selectedFileFormat}`;

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

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  setFileFormat(format: string) {
    this.selectedFileFormat = format;
    this.dropdownOpen = false;
  } 
}
