import { prisma } from "@core/services/prisma.service";
import { ConnectionInputModel } from "@core/connection/connection.model";

interface Model {
  id: string
}
interface NodeParams {
  where: object
  order: object
}

export async function paginate<T extends Model>(fnNodes: (params: NodeParams) => Promise<T[]>, nodeParams: NodeParams, fnCount: () => any, connection: ConnectionInputModel) {
  const { first, last, after, before } = connection;
  const cursor = after || before
  const take = first || last || 0;
  const direction = first ? 'next' : 'previous';
  const connectionGetNode = {
    cursor: cursor ? { id: cursor } : undefined,
    take: direction === 'next' ? take + 1 : -take - 1,
    skip: after || before ? 1 : 0,
  }
  const [nodes, totalCount] = await prisma.$transaction([
    fnNodes({
      ...nodeParams,
      ...connectionGetNode
    }),
    fnCount()
  ])

  const hasExtraNode = nodes.length > take;
  if (hasExtraNode) {
    if (first) {
      nodes.pop()
    } else if (last){
      nodes.shift()
    }
  }

  const startCursor = nodes ? nodes[0].id : undefined
  const endCursor = nodes ? nodes[nodes.length -1].id : undefined

  return {
    nodes,
    pageInfo: {
      hasNextPage: first != null ? hasExtraNode : before != null,
      hasPreviousPage: first != null ? after != null : hasExtraNode,
      startCursor,
      endCursor
    },
    totalCount
  };
}
