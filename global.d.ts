// global.d.ts
import type { MongoClient } from 'mongodb';

declare global {
  // On ajoute la propriété à global
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export {};
