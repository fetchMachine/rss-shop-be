import { handlerPath } from '@libs/handlerResolver';

export const catalogBatchProcessHandler  = {
  handler: `${handlerPath(__dirname)}/catalogBatchProcess.catalogBatchProcess`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: { 'Fn::GetAtt': ['SQSQueue', 'Arn'] },
      },
    }
  ]
};
