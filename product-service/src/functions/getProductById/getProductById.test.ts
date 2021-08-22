import type { APIGatewayProxyResult } from 'aws-lambda';

import { ERROS } from './errorMsgs';
import { getProductById } from './getProductById';

jest.mock('../products.mock.json', () => ({
  default: [{ id: 1, title: 'some_title' }]
}));

describe('getProducts', () => {
  it('getProductById return product by id', async () => {
    // @ts-ignore
    const result = await getProductById({ pathParameters: { productId: '1' } });

    const expectedResult: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ items: [{ id: 1, title: 'some_title' }] }),
    };

    expect(result).toEqual(expectedResult);
  });

  it('getProductById if get invalid id return 400', async () => {
    // @ts-ignore
    const result = await getProductById({ pathParameters: { productId: '1a' } });

    const expectedResult: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({ message: ERROS.INVALID_ID }),
    };

    expect(result).toEqual(expectedResult);
  });

  it('getProductById return 404 if product not founded', async () => {
    // @ts-ignore
    const result = await getProductById({ pathParameters: { productId: '2' } });

    const expectedResult: APIGatewayProxyResult = {
      statusCode: 404,
      body: JSON.stringify({ message: ERROS.PRODUCT_NOT_FOUNDED }),
    };

    expect(result).toEqual(expectedResult);
  });
});
