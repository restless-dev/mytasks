export interface Task {
  columnId: number;
  completed: boolean;
  description?: string;
  icon?: string;
  id: number;
  title: string;
  urgent: boolean;
}
