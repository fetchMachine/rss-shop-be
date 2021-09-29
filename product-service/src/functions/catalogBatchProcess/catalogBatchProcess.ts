import { logLambdaParams } from '@libs/loggers';

export const catalogBatchProcess = (e) => {
  logLambdaParams('catalogBatchProcess', e);
};
