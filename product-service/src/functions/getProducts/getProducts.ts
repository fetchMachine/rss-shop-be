import 'source-map-support/register';
import type { APIGatewayProxyResult } from 'aws-lambda';

import { ProductsProvider } from '@providers/products';

import { COMMON_HEADERS } from '@functions/constants';

export const getProducts = async (): Promise<APIGatewayProxyResult> => {
  try {
    const productsProvider = new ProductsProvider();

    const products = await productsProvider.getAll();

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
