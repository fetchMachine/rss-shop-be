import { handlerPath } from '@libs/handlerResolver';
import type { AWS } from '@serverless/typescript';

export const basicAuthorizerHandler: AWS['functions'][keyof AWS['functions']] = {
  handler: `${handlerPath(__dirname)}/basicAuthorizer.basicAuthorizer`,
  events: [
    {
      http: {
        method: 'get',
        path: '/token',
      }
    }
  ],
}
