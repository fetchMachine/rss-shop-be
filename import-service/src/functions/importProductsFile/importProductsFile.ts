import 'source-map-support/register';
import type { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { S3 } from 'aws-sdk';

import { logLambdaParams, logLambdaError } from '@libs/loggers';
import { COMMON_HEADERS, COMMON_ERROS, STATUS_CODES } from '@shared/constants';
import { IMPORT_ERRORS, UPLOAD_BUCKET_NAME, UPLOADED_PATH_PREFIX } from '@functions/constants';

export const importProductsFile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    logLambdaParams('importProductsFile', event);

    const s3 = new S3({ region: 'eu-west-1' });

    const { name } = event.queryStringParameters;

    if (!name) {
      return { statusCode: STATUS_CODES.BAD_REQUEST, body: JSON.stringify({ message: IMPORT_ERRORS.INVALID_FILE_NAME }) }
    }

    const singedUrl = await s3.getSignedUrlPromise('putObject', {
      Bucket: UPLOAD_BUCKET_NAME,
      Expires: 60,
      ContentType: 'text/csv',
      Key: `${UPLOADED_PATH_PREFIX}/${name}`,
    });

    return {
      statusCode: STATUS_CODES.OK,
      headers: { ...COMMON_HEADERS },
      body: JSON.stringify({
        url: singedUrl,
        name,
      }),
    };
  } catch(e) {
    logLambdaError('importProductsFile', e);
    return { statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR, body: JSON.stringify({ message: COMMON_ERROS.UNKNOWN }) }
  }
}
