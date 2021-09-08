import 'source-map-support/register';
import type { APIGatewayProxyResult } from 'aws-lambda';

import { ProductsProvider } from '@providers/products';

import { COMMON_HEADERS, ERROS, STATUS_CODES } from '@functions/constants';

export const getProducts = async (): Promise<APIGatewayProxyResult> => {
  try {
    const productsProvider = new ProductsProvider();

    const products = await productsProvider.getAll();

    return {
      statusCode: STATUS_CODES.OK,
      headers: { ...COMMON_HEADERS },
      body: JSON.stringify({
        items: products,
      }),
    };
  } catch(e) {
    console.log(e);
    return { statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR, body: JSON.stringify({ message: ERROS.UNKNOWN }) }
  }
}
