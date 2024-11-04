import { OrderByModel } from "./filters.model";

export function transformOrderByGraphQLToModel<T>(
  orderBy?: object
): T | undefined {
  if (!orderBy) {
    return undefined;
  }
  const orderByModel = Object.keys(orderBy).reduce((acc, key) => {
    const keyTyped = key as keyof typeof orderBy;
    const value = orderBy![keyTyped];

    acc[keyTyped] = typeof value === "string" ? OrderByModel[value] : value;

    return acc;
  }, {} as T);

  return orderByModel;
}

type ORType = {
  OR: any;
};
type Where = {
  or?: object[];
};
export function transformOrToOR<T extends Where>(data?: T) {
  if (!data) {
    return undefined;
  }
  if (!data.or) {
    return data;
  }
  const transformed = {
    ...data,
    OR: data.or ? data.or : undefined,
  };

  delete (transformed as any).or;

  return transformed;
}
