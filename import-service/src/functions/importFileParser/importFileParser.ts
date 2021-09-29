import 'source-map-support/register';
import type { S3Event } from 'aws-lambda';
import { S3 } from 'aws-sdk';
// @ts-ignore
import csv from 'csv-parser';

import { logLambdaParams, logLambdaError } from '@libs/loggers';
import { COMMON_ERROS, STATUS_CODES } from '@shared/constants';
import { UPLOAD_BUCKET_NAME, UPLOADED_PATH_PREFIX, PROCESSED_PATH_PREFIX } from '@functions/constants';

export const importFileParser = async (event: S3Event): Promise<any> => {
  try {
    logLambdaParams('importFileParser', event);

    const s3 = new S3({ region: 'eu-west-1' });

    return new Promise((res, rej) => {
      for (const record of event.Records) {
        const s3ReadStream = s3.getObject({
          Bucket: UPLOAD_BUCKET_NAME,
          Key: record.s3.object.key,
        }).createReadStream();

        s3ReadStream.pipe(csv())
          .on('data', (data) => {
            console.log(`importFileParser parse record: ${JSON.stringify(data)}`);
          })
          .on('end', async () => {
            await s3.copyObject({
              Bucket: UPLOAD_BUCKET_NAME,
              Key: record.s3.object.key.replace(UPLOADED_PATH_PREFIX, PROCESSED_PATH_PREFIX),
              CopySource: `${UPLOAD_BUCKET_NAME}/${record.s3.object.key}`
            }).promise();

            await s3.deleteObject({
              Bucket: UPLOAD_BUCKET_NAME,
              Key: record.s3.object.key,
            }).promise();

            res({ statusCode: STATUS_CODES.OK });
          })
          .on('error', (e) => {
            logLambdaError('importFileParser', e);
            rej({ statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR, body: JSON.stringify({ message: COMMON_ERROS.UNKNOWN }) });
          });
      }
    });
  } catch(e) {
    logLambdaError('importFileParser', e);
    return { statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR, body: JSON.stringify({ message: COMMON_ERROS.UNKNOWN }) }
  }
}
