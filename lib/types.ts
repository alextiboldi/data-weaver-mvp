export type Project = {
  id: string;
  name: string;
  dataSource: string;
  connectionConfig: any;
  selectedTables: string[];
  tables: Array<Table>;
  queries: Array<Query>;
};
export type Query = {
  id: string;
  name: string;
  query: string;
};

export type Table = {
  id: string;
  name: string;
  columns: Array<Column>;
  relationships: Array<Relationship>;
  reverseRels: Array<Relationship>;
  comment: string;
};

export type Column = {
  id: string;
  name: string;
  type: string;
  isPrimaryKey: boolean;
  comment: string;
};

export interface Relationship {
  id: string;
  sourceTableId: string;
  sourceColumn: string;
  targetTableId: string;
  targetColumn: string;
}

export interface Position {
  x: number;
  y: number;
}
