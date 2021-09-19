import { handlerPath } from '@libs/handlerResolver';

export const postProductsHandler = {
  handler: `${handlerPath(__dirname)}/createProduct.createProduct`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
      }
    }
  ]
}
