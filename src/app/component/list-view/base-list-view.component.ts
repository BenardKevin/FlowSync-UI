import { Component, inject } from '@angular/core';
import { LIST_CONFIG, ListViewConfig } from './list-view.config';
import { faPen, faTrash, faSort, faFilter, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  template: ''
})
export class BaseListViewComponent<T> {
  protected items: T[] = [];
  protected cachedItems: T[] = [];
  protected currentPage: number = 1;
  protected config: ListViewConfig = inject(LIST_CONFIG);
  protected sortOrder: number = 0;
  protected lastColumnSorted: string = "";

  protected faPen: IconDefinition = faPen;
  protected faTrash: IconDefinition = faTrash;
  protected faSort: IconDefinition = faSort;
  protected faFilter: IconDefinition = faFilter;
  
  protected get totalPages(): number {
    return Math.ceil(this.items.length / this.config.pageSize);
  }

  protected get visibleItems(): T[] {
    const start = (this.currentPage - 1) * this.config.pageSize;
    return this.items.slice(start, start + this.config.pageSize);
  }

    getItemValue(item: T, key: string): any {
      return item[key as keyof T];
  }

  protected sortBy(column: string): void {
    if(!this.config.sortable) return;
    
    // Logique de tri commune
    if(this.lastColumnSorted === column) {
      this.sortOrder = (this.sortOrder + 1) % 3;
    } else {
      this.sortOrder = 0;
      this.lastColumnSorted = column;
    }
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected filter(column: string, value: string): void {
    if(!this.config.filterable) return;
    // Logique de filtrage commune
    
    this.items = this.cachedItems.filter( (item) => {
      return new RegExp(value, 'i').test(this.getItemValue(item, column));
    });
  }

  protected delete(id: number): void {
    if(!this.config.actions?.delete) return;
  }
}