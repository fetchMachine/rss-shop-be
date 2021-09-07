import { handlerPath } from '@libs/handlerResolver';

export const getProductByIdHandler = {
  handler: `${handlerPath(__dirname)}/getProductById.getProductById`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        request: { parameters: { paths: { productId: true } } },
      }
    }
  ]
}
