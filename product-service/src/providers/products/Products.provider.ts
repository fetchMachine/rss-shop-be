import { Client } from 'pg';

import type { Product, NewProduct } from './Product.type';

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

  private async makeQuery<T>(query: string, params?: (string | number)[]): Promise<T[]> {
    try {
      await this.client.connect();

      const { rows } = await this.client.query<T>(query, params);

      return rows;
    } finally {
      await this.client.end();
    }
  }

  public async getAll (): Promise<Product[]> {
    const query = 'SELECT * FROM products p LEFT JOIN stocks s ON p.id = s.product_id';

    return this.makeQuery(query);
  }

  public async getById (id: string): Promise<Product[]> {
    const query = 'SELECT * FROM products p LEFT JOIN stocks s ON p.id = s.product_id where p.id = $1';

    return this.makeQuery(query, [id]);
  }

  public async addProduct (productToCreate: NewProduct): Promise<{ id: string }> {
    await this.client.connect();
    try {
      const { description, price, title, count } = productToCreate;

      await this.client.query('BEGIN');

      const queryProduct = 'INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id';
      const { rows } = await this.client.query<Product>(queryProduct, [title, description, price]);

      const { id } = rows[0];

      const queryStock = 'INSERT INTO stocks (product_id, count) VALUES ($1, $2)';

      await this.client.query(queryStock, [id, count]);

      await this.client.query('COMMIT');

      return rows[0];
    } catch (e) {
      await this.client.query('ROLLBACK');
      throw e
    } finally {
      await this.client.end();
    }
  }
}
