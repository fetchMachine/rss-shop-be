import 'source-map-support/register';
import type { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

import { logLambdaParams, logLambdaError } from '@libs/loggers';
import { ProductsProvider, NewProduct } from '@providers/products';
import { COMMON_HEADERS, ERROS, STATUS_CODES } from '@functions/constants';
import { productSchema } from '@functions/productSchema'

export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logLambdaParams('createProduct', event);

    const product: NewProduct = JSON.parse(event.body);

    const isProductValid = await productSchema.isValid(product);

    if (!isProductValid) {
      return { statusCode: STATUS_CODES.BAD_REQUEST, body: JSON.stringify({ message: ERROS.INVALID_BODY }) }
    }

    const productsProvider = new ProductsProvider();

    const products = await productsProvider.addProduct(product);

    return {
      statusCode: STATUS_CODES.OK,
      headers: { ...COMMON_HEADERS },
      body: JSON.stringify({
        items: products,
      }),
    };
  } catch(e) {
    logLambdaError('createProduct', e);
    return { statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR, body: JSON.stringify({ message: ERROS.UNKNOWN }) }
  }
}
