import 'source-map-support/register';

import type { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerCallback, AuthResponseContext } from 'aws-lambda';
import { logLambdaError, logLambdaParams } from '@shared/loggers';
import { generatePolicy } from '@libs/generatePolicy';


export const basicAuthorizer = async (e: APIGatewayTokenAuthorizerEvent, _: AuthResponseContext, cb: APIGatewayAuthorizerCallback) => {
  try {
    logLambdaParams('basicAuthorizer', e);

    if (e.type !== 'TOKEN' || !e.authorizationToken) {
      return cb('Unauthorized');
    }

    const token = e.authorizationToken.split(' ')[1];

    const buff = Buffer.from(token, 'base64');
    const plainCreds = buff.toString('utf-8');
    const [login, password] =  plainCreds.split(':');

    const LOGIN = 'fetchmachine';
    const PASSWORD = process.env[LOGIN];

    const effect = (login === LOGIN &&  password === PASSWORD) ? 'Allow' : 'Deny';

    cb(null, generatePolicy(token, e.methodArn, effect));
  } catch (e) {
    logLambdaError('basicAuthorizer', e);
    return cb('Unauthorized');
  }
}
