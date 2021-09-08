import { Pool } from 'pg';

import type { Product, NewProduct } from './Product.type';

export class ProductsProvider {
  private pool: Pool;

  constructor (config: {
    host?: string,
    port?: number,
    database?: string,
    user?: string,
    password?: string,
  } = {}) {
    this.pool = new Pool({
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
    const client = await this.pool.connect();

    try {
      const { rows } = await client.query<T>(query, params);

      return rows;
    } finally {
      await client.release();
    }
  }

  public async getAll (): Promise<Product[]> {
    const query = 'SELECT id, title, description, price, count FROM products p LEFT JOIN stocks s ON p.id = s.product_id';

    return this.makeQuery(query);
  }

  public async getById (id: string): Promise<Product[]> {
    const query = 'SELECT id, title, description, price, count FROM products p LEFT JOIN stocks s ON p.id = s.product_id where p.id = $1';

    return this.makeQuery(query, [id]);
  }

  public async addProduct (productToCreate: NewProduct): Promise<Product[]> {
    const client = await this.pool.connect();

    try {
      const { description, price, title, count } = productToCreate;

      await client.query('BEGIN');

      const queryProduct = 'INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id';
      const { rows } = await client.query<Product>(queryProduct, [title, description, price]);

      const { id } = rows[0];

      const queryStock = 'INSERT INTO stocks (product_id, count) VALUES ($1, $2)';

      await client.query(queryStock, [id, count]);

      await client.query('COMMIT');

      return this.getById(id);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e
    } finally {
      await client.release();
    }
  }
}
