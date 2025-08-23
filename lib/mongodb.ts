// lib/mongodb.ts
import { MongoClient } from 'mongodb';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// En développement, on utilise une variable globale pour réutiliser la connexion
if (!global._mongoClientPromise) {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in environment variables');
  }
  client = new MongoClient(process.env.MONGODB_URI);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;