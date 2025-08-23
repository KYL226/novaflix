// lib/models.ts
import clientPromise from './mongodb';
import { User, Movie, Subscription } from '@/types';

class Database {
  private client = clientPromise;
  private db = this.client.then((c) => c.db('novaflix'));

  async getUsers() {
    return (await this.db).collection<User>('users');
  }

  async getMovies() {
    return (await this.db).collection<Movie>('movies');
  }

  async getSubscriptions() {
    return (await this.db).collection<Subscription>('subscriptions');
  }

  async close() {
    const client = await this.client;
    await client.close();
  }
}

export const db = new Database();