import 'source-map-support/register';
import type { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

import { logLambdaParams, logLambdaError } from '@libs/loggers';
import { ProductsProvider } from '@providers/products';
import { COMMON_HEADERS, ERROS, STATUS_CODES } from '@functions/constants';

export const getProducts = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logLambdaParams('getProducts', event);

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
    logLambdaError('getProducts', e);
    return { statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR, body: JSON.stringify({ message: ERROS.UNKNOWN }) }
  }
}
