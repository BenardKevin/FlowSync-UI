import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faPlus, faCircleArrowUp, faCircleArrowDown, faGrip, faList } from '@fortawesome/free-solid-svg-icons';
import { UserPreferencesService } from '../../service/user-preferences/user-preferences.service';
import * as XLSX from 'xlsx';
import { catchError, throwError } from 'rxjs';
import { DataService } from '../../service/data/data.service';

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

  constructor(
    private dataService: DataService,
    private userPrefService: UserPreferencesService,
    private router: Router
  ) { }

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
    input.accept = '.xlsx, .csv';

    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        const route = this.getMainRoute();
        jsonData.forEach((data: any) => {
          
        console.log('payload', data)
          this.dataService.createData(route, data).subscribe({
            next: (response: any) => {
              console.log('Product imported successfully:', response);
            },
            error: (error: any) => {
              console.error('Failed to import product:', error);
            }
          });
        });
      };

      reader.readAsArrayBuffer(file);
    });

    input.click();
  }

  exportObject() {
    const route = this.getMainRoute();
    this.dataService.getData(route).pipe(
      catchError((error) => {
        console.error(`Failed to fetch ${route} data:`, error);
        return throwError(() => error);
      })
    ).subscribe((data) => {
      if (data && data.length > 0) {
        const formattedData = this.dataService.formatExportData(route, data);
        const workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
        const fileName = this.createFileName(`${route.charAt(0).toUpperCase() + route.slice(1)}Data`);

        this.exportToFile(workSheet, fileName);
      } else {
        console.warn(`No ${route} data available to export.`);
      }
    });
  }

  private exportToFile(workSheet: XLSX.WorkSheet, fileName: string) {
    switch(this.selectedFileFormat) {
      case 'csv':
      this.exportToCsv(workSheet, fileName);
        break;

      default:
        this.exportToXlsx(workSheet, fileName);
    }
  }

  private exportToXlsx(workSheet: XLSX.WorkSheet, fileName: string) {
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, fileName);
    XLSX.writeFile(workBook, fileName);
  }

  private createFileName(baseFileName: string) {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const dateTime = `${formattedDate}_${hours}-${minutes}-${seconds}`;
    const fileName = `${baseFileName}_${dateTime}.${this.selectedFileFormat}`;
    return fileName;
  }

  private exportToCsv(workSheet: XLSX.WorkSheet, fileName: string) {
    const csvOutput = XLSX.utils.sheet_to_csv(workSheet);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
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
