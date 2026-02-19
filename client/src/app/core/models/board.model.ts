import { Column } from './column.model';

export interface Board {
  columns: Column[];
  icon?: string;
  id: number;
  title: string;
}
