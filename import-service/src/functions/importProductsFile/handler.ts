import { handlerPath } from '@libs/handlerResolver';
import type { AWS } from '@serverless/typescript';

export const importProductsFile: AWS['functions'][keyof AWS['functions']] = {
  handler: `${handlerPath(__dirname)}/importProductsFile.importProductsFile`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        request: { parameters: { querystrings: { name: true } } },
      }
    }
  ]
}
