import { SNS } from 'aws-sdk';

import { logLambdaParams, logLambdaError } from '@libs/loggers';
import { DEFAULT_REGION } from '@shared/constants';

export const catalogBatchProcess = async (event) => {
  try {
    logLambdaParams('catalogBatchProcess', event);

    const sns = new SNS({ region: DEFAULT_REGION });

    await sns.publish({
      Subject: 'Меня дернули',
      Message: 'Меня дернули и я отработала',
      TopicArn: process.env.SNS_ARN
    }).promise();


  } catch (e) {
    logLambdaError('catalogBatchProcess', e);
  }
};
