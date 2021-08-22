import 'source-map-support/register';
import type { APIGatewayProxyResult } from 'aws-lambda';

import products from './products.mock.json';

export const getProducts = async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      items: products,
    }),
  };
}
