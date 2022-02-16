export type RawEmployee = {
  id: number;
  name: string;
  title: string;
  manager_id?: number;
};

export type EmployeeTree = {
  name: string;
  title: string;
  subordinates: EmployeeTree[];
};