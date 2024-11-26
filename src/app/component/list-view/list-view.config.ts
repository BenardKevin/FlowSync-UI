import { InjectionToken } from '@angular/core';

export interface ListViewConfig {
  pageSize: number;
  sortable: boolean;
  filterable: boolean;
  columns: {
    key: string;
    label: string;
    sortable?: boolean;
    filterable?: boolean;
    width?: string;
  }[];
  actions?: {
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
  };
}

export const LIST_CONFIG = new InjectionToken<ListViewConfig>('LIST_CONFIG');