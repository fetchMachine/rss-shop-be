import 'source-map-support/register';
import * as yup from 'yup';
import type { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

import { COMMON_HEADERS } from '@functions/constants';
import { ProductsProvider } from '@providers/products';

import { ERROS } from './errorMsgs';

export const getProductById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { productId = '' } = event.pathParameters;

    const isValidId = await yup.string().uuid().isValid(productId);

    if (!isValidId) {
      return { statusCode: 400, body: JSON.stringify({ message: ERROS.INVALID_ID }) };
    }

    const productsProvider = new ProductsProvider();

    const products = await productsProvider.getById(productId);

    if (!products.length) {
      return { statusCode: 404, body: JSON.stringify({ message: ERROS.PRODUCT_NOT_FOUNDED }) };
    }

    return {
      statusCode: 200,
      headers: { ...COMMON_HEADERS },
      body: JSON.stringify({
        items: products,
      }),
    };
  } catch (e) {
    console.log(e);
    return { statusCode: 500, body: JSON.stringify({ message: 'something go wrong' }) }
  }
}
