import { handlerPath } from '@libs/handlerResolver';
import type { AWS } from '@serverless/typescript';
import { UPLOAD_BUCKET_NAME, UPLOADED_PATH_PREFIX } from '@functions/constants';

export const importFileParser: AWS['functions'][keyof AWS['functions']] = {
  handler: `${handlerPath(__dirname)}/importFileParser.importFileParser`,
  events: [
    {
      s3: {
        bucket: UPLOAD_BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        existing: true,
        rules: [{ prefix: `${UPLOADED_PATH_PREFIX}/` }],
      }
    }
  ]
}
