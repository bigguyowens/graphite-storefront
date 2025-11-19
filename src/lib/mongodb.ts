import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise:
    | Promise<MongoClient>
    | undefined;
}

const uri = process.env.MONGODB_URI;

let clientPromise: Promise<MongoClient> | null = null;

async function createClient() {
  if (!uri) {
    return null;
  }

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client
      .connect()
      .catch((error) => {
        clientPromise = null;
        console.error(
          "[mongo] Failed to connect",
          error,
        );
        throw error;
      });

    if (process.env.NODE_ENV !== "production") {
      global._mongoClientPromise = clientPromise;
    }
  }

  return clientPromise;
}

export async function getMongoClient() {
  if (global._mongoClientPromise) {
    return global._mongoClientPromise;
  }

  return createClient();
}

export async function getDatabase() {
  const client = await getMongoClient();
  if (!client) {
    return null;
  }

  const dbName =
    process.env.MONGODB_DB ?? "nextjs_ecomm";
  return client.db(dbName);
}
