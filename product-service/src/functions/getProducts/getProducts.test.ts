import type { APIGatewayProxyResult } from 'aws-lambda';

import { getProducts } from './getProducts';

jest.mock('@functions/products.mock.json', () => ({
  default: [{ id: 'abc' }, { id: 'bca' }],
}));

describe('getProducts', () => {
  it('getProducts return list of all products', async () => {
    const result = await getProducts();

    const expectedResult: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ items: [{ id: 'abc' }, { id: 'bca' }] }),
    };


    expect(result).toMatchObject(expectedResult);
  });
});
