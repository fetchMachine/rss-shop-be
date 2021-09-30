import { SNS } from 'aws-sdk';
import type { SQSEvent } from 'aws-lambda';

import { logLambdaParams, logLambdaError } from '@shared/loggers';
import { DEFAULT_REGION } from '@shared/constants';

import { ProductsProvider } from '@providers/products';
import type { NewProduct } from '@providers/products';

export const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    logLambdaParams('catalogBatchProcess', event);

    const sns = new SNS({ region: DEFAULT_REGION });
    const productsProvider = new ProductsProvider();

    event.Records.forEach(async (record) => {
      const { body } = record;

      const product: NewProduct = JSON.parse(body);

      await productsProvider.addProduct(product);
    });

    await sns.publish({
      Subject: 'В Базу добавлены новые продукты',
      Message: `В БД было добавлено ${event.Records.length} продуктов`,
      TopicArn: process.env.SNS_ARN
    }).promise();


  } catch (e) {
    logLambdaError('catalogBatchProcess', e);
  }
};
