import 'source-map-support/register';
import type { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

import { ERROS } from './errorMsgs';

import products from '../products.mock.json';

export const getProductById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { productId = '' } = event.pathParameters;

  const id = parseInt(productId, 10);

  if (!id || Number.isNaN(id) || id.toString() !== productId) {
    return { statusCode: 400, body: JSON.stringify({ message: ERROS.INVALID_ID }) };
  }

  const product = products.find((product) => product.id === id);

  if (!product) {
    return { statusCode: 404, body: JSON.stringify({ message: ERROS.PRODUCT_NOT_FOUNDED }) };
  }


  return {
    statusCode: 200,
    body: JSON.stringify({
      items: [product],
    }),
  };
}
