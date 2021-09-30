import type { SQSEvent } from 'aws-lambda'

import { catalogBatchProcess } from './catalogBatchProcess';

import { logLambdaParams, logLambdaError } from '@shared/loggers';

jest.mock('@shared/loggers');

const mockSnsPublish = jest.fn().mockImplementation(() => ({ promise: jest.fn() }));
jest.mock('aws-sdk', () => ({
  SNS: jest.fn().mockImplementation(() => ({ publish: mockSnsPublish })),
}));

const mockProviderAddProduct = jest.fn();
jest.mock('@providers/products', () => ({
  ProductsProvider: jest.fn().mockImplementation(() => ({ addProduct: mockProviderAddProduct }))
}));


describe('catalogBatchProcess', () => {
  it('Если вызвана, то логирует свои параметры', async () => {
    const PARAMS = { queryStringParameters: { name: 'some_name', value: '2' } } as unknown as SQSEvent;

    await catalogBatchProcess(PARAMS);

    expect(logLambdaParams).toBeCalledWith('catalogBatchProcess', PARAMS);
  });

  it('Добавялет в БД все записи', async () => {
    const PRODUCT_1 = { title: 'Some product 1', price: 10, count: 4 };
    const PRODUCT_2 = { title: 'Some product 2', price: 22, count: 66 };

    const EVENT = { Records: [{ body: JSON.stringify(PRODUCT_1) }, { body: JSON.stringify(PRODUCT_2) }] } as SQSEvent;

    await catalogBatchProcess(EVENT);

    expect(mockProviderAddProduct).toHaveBeenNthCalledWith(1, PRODUCT_1);
    expect(mockProviderAddProduct).toHaveBeenNthCalledWith(2, PRODUCT_2);
  });

  it('Отправялет сообщение в sns с кол-вом добавленных продуктов', async () => {
    const PRODUCT_1 = { title: 'Some product 1', price: 10, count: 4 };
    const PRODUCT_2 = { title: 'Some product 2', price: 22, count: 66 };

    const EVENT = { Records: [{ body: JSON.stringify(PRODUCT_1) }, { body: JSON.stringify(PRODUCT_2) }] } as SQSEvent;

    await catalogBatchProcess(EVENT);

    expect(mockSnsPublish).toBeCalledWith({
      Subject: 'В Базу добавлены новые продукты',
      Message: `В БД было добавлено 2 продуктов`,
    });
  });

  it('Логирует ошибки', async () => {
    mockSnsPublish.mockRejectedValue('some error')

    const PRODUCT_1 = { title: 'Some product 1', price: 10, count: 4 };
    const PRODUCT_2 = { title: 'Some product 2', price: 22, count: 66 };

    const EVENT = { Records: [{ body: JSON.stringify(PRODUCT_1) }, { body: JSON.stringify(PRODUCT_2) }] } as SQSEvent;

    await catalogBatchProcess(EVENT);

    expect(logLambdaError).toBeCalledTimes(1);
  });
});
