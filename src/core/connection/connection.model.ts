export interface NodeModel {
  id: string;
}

export interface EdgeModel<T extends NodeModel> {
  cursor: string;
  node: T;
}

export interface ConnectionModel<T extends NodeModel> {
  edges: EdgeModel<T>[];
  pageInfo: PageInfoModel;
  count: number;
}

export interface PageInfoModel {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface PageInfoModel {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface ConnectionInputModel {
  first: number;
  last?: number;
  after?: string;
  before?: string;
}
