import { Component, inject, OnInit } from '@angular/core';
import { LIST_CONFIG, ListViewConfig } from './list-view.config';
import { faPen, faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  template: ''
})
export class BaseListViewComponent<T> {
  protected items: T[] = [];
  protected currentPage: number = 1;
  protected config: ListViewConfig = inject(LIST_CONFIG);
  
  protected faPen: IconDefinition = faPen;
  protected faTrash: IconDefinition = faTrash;
  
  protected get totalPages(): number {
    return Math.ceil(this.items.length / this.config.pageSize);
  }

  protected get visibleItems(): T[] {
    const start = (this.currentPage - 1) * this.config.pageSize;
    return this.items.slice(start, start + this.config.pageSize);
  }

  protected sortBy(column: string): void {
    if (!this.config.sortable) return;
    // Logique de tri commune
  }

  protected filter(column: string, value: string): void {
    if (!this.config.filterable) return;
    // Logique de filtrage commune
  }
}