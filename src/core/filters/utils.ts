import { OrderByModel } from "./filters.model";

export function transformOrderByGraphQLToModel<T>(orderBy: object): T {
  const orderByModel = Object.keys(orderBy).reduce((acc, key) => {
    const keyTyped = key as keyof typeof orderBy
    const value = orderBy![keyTyped];
  
    acc[keyTyped] = typeof value === 'string' ? OrderByModel[value] : value;
  
    return acc;
  }, {} as T);

  return orderByModel
}