export type ProjectInfo = {
  id: string;
  name: string;
  description?: string;
};

export type Project = {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  dataSource: string;
  connectionConfig: any;
  selectedTables: string[];
  tables: Array<Table>;
  queries: Array<Query>;
};

export type TableRelation = {
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
  relationType: "PRIMARY KEY" | "FOREIGN KEY" | "NONE";
};
export type Query = {
  id: string;
  name: string;
  description: string;
  query: string;
};

export type Table = {
  id: string;
  name: string;
  synonym?: string;
  columns: Array<Column>;
  relationships: Array<Relationship>;
  reverseRels: Array<Relationship>;
  comment?: string;
  description?: string;
};

export type Column = {
  id: string;
  name: string;
  synonym?: string;
  type: string;
  isPrimaryKey: boolean;
  comment?: string;
  description?: string;
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
