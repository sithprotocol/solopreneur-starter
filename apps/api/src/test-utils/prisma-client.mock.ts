export class PrismaClient {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_options?: unknown) {
    // mock — no connection
  }

  async $connect() {
    return undefined;
  }

  async $disconnect() {
    return undefined;
  }

  async $queryRaw() {
    return [];
  }

  user = {
    findMany: async () => [],
    upsert: async () => ({}),
  };
}
