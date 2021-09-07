import 'source-map-support/register';
import type { APIGatewayProxyResult } from 'aws-lambda';

import { COMMON_HEADERS } from '@functions/constants';

import products from '@functions/products.mock.json';

export const getProducts = async (): Promise<APIGatewayProxyResult> => {
  try {
    return {
      statusCode: 200,
      headers: { ...COMMON_HEADERS },
      body: JSON.stringify({
        items: products,
      }),
    };
  } catch(e) {
    console.log(e);
    return { statusCode: 500, body: JSON.stringify({ message: 'something go wrong' }) }
  }
}
