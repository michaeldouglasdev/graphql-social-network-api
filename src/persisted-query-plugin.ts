import { useAPQ } from "@graphql-yoga/plugin-apq";
import { usePersistedOperations } from "@graphql-yoga/plugin-persisted-operations";
import Keyv from "keyv";
import KeyvRedis from "@keyv/redis";
import { Environment } from "@core/environment";

const keyv = new Keyv(new KeyvRedis("redis://@localhost:6379"));
export const usePersistedQuery = () => {
  const automaticPersistedQuery = useAPQ({
    store: {
      async get(key) {
        try {
          return await keyv.get(key);
        } catch (e) {
          console.error(`Error while fetching the operation: ${key}`, e);
        }
      },
      async set(key, value) {
        try {
          return await keyv.set(key, value);
        } catch (e) {
          console.error(`Error while saving the operation: ${key}`, e);
        }
      },
    },
  });

  const persistedQuery = usePersistedOperations({
    async getPersistedOperation(sha256Hash: string) {
      const value = await keyv.get(sha256Hash);
      return value;
    },
  });

  return Environment.isNotProduction()
    ? automaticPersistedQuery
    : persistedQuery;
};
