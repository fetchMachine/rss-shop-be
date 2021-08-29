import 'source-map-support/register';
import type { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

import { COMMON_HEADERS } from '@functions/constants';
import products from '@functions/products.mock.json';

import { ERROS } from './errorMsgs';

export const getProductById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { productId = '' } = event.pathParameters;
    const productIdStringed = productId?.toString();

    if (!productIdStringed) {
      return { statusCode: 400, body: JSON.stringify({ message: ERROS.INVALID_ID }) };
    }

    const product = products.find((product) => product.id === productIdStringed);

    if (!product) {
      return { statusCode: 404, body: JSON.stringify({ message: ERROS.PRODUCT_NOT_FOUNDED }) };
    }


    return {
      statusCode: 200,
      headers: { ...COMMON_HEADERS },
      body: JSON.stringify({
        items: [product],
      }),
    };
  } catch (e) {
    console.log(e);
    return { statusCode: 500, body: JSON.stringify({ message: 'something go wrong' }) }
  }
}
