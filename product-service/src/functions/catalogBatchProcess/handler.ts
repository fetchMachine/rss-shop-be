import { handlerPath } from '@libs/handlerResolver';

export const catalogBatchProcessHandler  = {
  handler: `${handlerPath(__dirname)}/catalogBatchProcess.catalogBatchProcess`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
      }
    }
  ]
};
