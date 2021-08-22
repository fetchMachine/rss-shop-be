import type { APIGatewayProxyResult } from 'aws-lambda';

import { getProducts } from './getProducts';

import products from '../products.mock.json';

describe('getProducts', () => {
  it('getProducts return list of all products', async () => {
    const result = await getProducts();

    const expectedResult: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ items: products }),
    };


    expect(result).toEqual(expectedResult);
  });
});
