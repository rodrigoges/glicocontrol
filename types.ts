export enum Classification {
  HYPOGLYCEMIA = 'HIPOGLICEMIA',
  NORMAL = 'NORMAL',
  HYPERGLYCEMIA = 'HIPERGLICEMIA',
  UNCLASSIFIED = 'NÃO CLASSIFICADO'
}

export interface Measurement {
  id: string;
  value: number;
  classification: Classification;
  date: string; // ISO 8601 string format for easy serialization
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}