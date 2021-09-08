import { Client } from 'pg';

import type { Product } from './Product.type';

export class ProductsProvider {
  private client: Client;

  constructor (config: {
    host?: string,
    port?: number,
    database?: string,
    user?: string,
    password?: string,
  } = {}) {
    this.client = new Client({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      database: process.env.DB_DATABASE,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      ...config,
    });
  }

  private async makeQuery<T>(query: string): Promise<T[]> {
    try {
      await this.client.connect();

      const { rows } = await this.client.query<T>(query);

      return rows;
    } finally {
      await this.client.end();
    }
  }

  public async getAll (): Promise<Product[]> {
    const GET_ALL_QUERRY = `SELECT * FROM products p LEFT JOIN stocks s ON p.id = s.product_id`;

    return this.makeQuery(GET_ALL_QUERRY);
  }

  public async getById (id: string): Promise<Product[]> {
    const GET_BY_ID_QUERRY = `SELECT * FROM products p LEFT JOIN stocks s ON p.id = s.product_id where p.id = ${id}`;

    return this.makeQuery(GET_BY_ID_QUERRY);
  }
}
