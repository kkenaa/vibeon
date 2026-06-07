import type { Component } from "vue";

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  type: "text" | "number" | "date" | "component" | "grid";
  formatter?: (value: any) => string;
  editable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  component?: Component;
  componentProps?:
    | Record<string, any>
    | ((row: any, rowIndex: number) => Record<string, any>);
  /** When true, clicks in this cell do not trigger the grid row click handler. */
  stopRowClick?: boolean;
  gridConfig?: GridConfig;
  onClick?: (row: any, rowIndex: number) => void;
}

export interface GridConfig {
  columns: Column[];
  data?: any[];
  pagination?: boolean;
  pageSize?: number;
  searchable?: boolean;
  filterable?: boolean;
}

export interface Filter {
  key: string;
  value: string;
}
