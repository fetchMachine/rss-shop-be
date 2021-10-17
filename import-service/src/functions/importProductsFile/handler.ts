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
        cors: true,
        authorizer: {
          name: 'basicAuthorizerHandler',
          arn: '${cf:authorization-service-${self:provider.stage}.authorizationArn}',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        },
      }
    }
  ]
}
