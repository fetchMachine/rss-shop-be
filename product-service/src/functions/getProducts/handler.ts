import { handlerPath } from '@libs/handlerResolver';

export const getProductsHandler = {
  handler: `${handlerPath(__dirname)}/getProducts.getProducts`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
      }
    }
  ]
}
