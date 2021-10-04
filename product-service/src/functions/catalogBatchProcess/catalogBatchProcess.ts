import { SNS } from 'aws-sdk';
import type { SQSEvent } from 'aws-lambda';

import { logLambdaParams, logLambdaError } from '@shared/loggers';
import { DEFAULT_REGION } from '@shared/constants';

import { ProductsProvider } from '@providers/products';
import type { NewProduct } from '@providers/products';
import { productSchema } from '@functions/productSchema';

export const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    logLambdaParams('catalogBatchProcess', event);

    const sns = new SNS({ region: DEFAULT_REGION });
    const productsProvider = new ProductsProvider();

    for (const record of event.Records) {
      const { body } = record;

      const product: NewProduct = JSON.parse(body);

      const isValidProduct = await productSchema.isValid(product);

      if (!isValidProduct) {
        console.log(`catalogBatchProcess: invalid product. ${JSON.stringify(product)}`);
        return;
      }

      await productsProvider.addProduct(product);
    }

    await sns.publish({
      Subject: 'В Базу добавлены новые продукты',
      Message: `В БД было добавлено ${event.Records.length} продуктов`,
      TopicArn: process.env.SNS_ARN
    }).promise();


  } catch (e) {
    logLambdaError('catalogBatchProcess', e);
  }
};
