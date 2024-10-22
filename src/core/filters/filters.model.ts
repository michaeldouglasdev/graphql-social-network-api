export interface StringFilterInputModel {
  equals?: string;
  in?: string[] | undefined;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  not?: string;
  notIn?: string[];
}

export interface DateTimeFilterInputModel {
  equals?: string;
  in?: string[] | undefined;
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  not?: string;
  notIn?: string[] | undefined;
}

export enum OrderByModel {
  ASC = 'asc',
  DESC = 'desc'
}