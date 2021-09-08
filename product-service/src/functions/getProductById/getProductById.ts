import 'source-map-support/register';
import * as yup from 'yup';
import type { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

import { COMMON_HEADERS, ERROS, STATUS_CODES } from '@functions/constants';
import { ProductsProvider } from '@providers/products';

export const getProductById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { productId = '' } = event.pathParameters;

    const isValidId = await yup.string().uuid().isValid(productId);

    if (!isValidId) {
      return { statusCode: STATUS_CODES.BAD_REQUEST, body: JSON.stringify({ message: ERROS.INVALID_ID }) };
    }

    const productsProvider = new ProductsProvider();

    const products = await productsProvider.getById(productId);

    if (!products.length) {
      return { statusCode: STATUS_CODES.NOT_FOUND, body: JSON.stringify({ message: ERROS.PRODUCT_NOT_FOUNDED }) };
    }

    return {
      statusCode: STATUS_CODES.OK,
      headers: { ...COMMON_HEADERS },
      body: JSON.stringify({
        items: products,
      }),
    };
  } catch (e) {
    console.log(e);
    return { statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR, body: JSON.stringify({ message: ERROS.UNKNOWN }) }
  }
}
