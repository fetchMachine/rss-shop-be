import type { APIGatewayProxyResult } from 'aws-lambda';

import { ERROS } from './errorMsgs';
import { getProductById } from './getProductById';

jest.mock('@functions/products.mock.json', () => ({
  default: [{ id: '1', title: 'some_title' }],
}));

describe('getProductById', () => {
  it('getProductById return product by id', async () => {
    // @ts-ignore
    const result = await getProductById({ pathParameters: { productId: '1' } });

    const expectedResult: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ items: [{ id: '1', title: 'some_title' }] }),
    };

    expect(result).toMatchObject(expectedResult);
  });

  it('getProductById return 400 when get invalid id', async () => {
    // @ts-ignore
    const result = await getProductById({ pathParameters: { productId: '' } });

    const expectedResult: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({ message: ERROS.INVALID_ID }),
    };

    expect(result).toMatchObject(expectedResult);
  });

  it('getProductById return 404 when product not founded', async () => {
    // @ts-ignore
    const result = await getProductById({ pathParameters: { productId: '2' } });

    const expectedResult: APIGatewayProxyResult = {
      statusCode: 404,
      body: JSON.stringify({ message: ERROS.PRODUCT_NOT_FOUNDED }),
    };

    expect(result).toMatchObject(expectedResult);
  });
});
