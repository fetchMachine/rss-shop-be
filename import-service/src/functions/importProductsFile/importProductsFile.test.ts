// @ts-ignore
import { COMMON_HEADERS, COMMON_ERROS, STATUS_CODES } from '@shared/constants';
import { IMPORT_ERRORS } from '@functions/constants';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { importProductsFile } from './importProductsFile';
import { logLambdaError, logLambdaParams } from '@libs/loggers';

const mockGetSignedUrlPromise = jest.fn();

jest.mock('@libs/loggers');

jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({ getSignedUrlPromise: mockGetSignedUrlPromise })),
}));

describe('importProductsFile', () => {
  it('Если вызвана, то логирует свои параметры', async () => {
    const PARAMS = { queryStringParameters: { name: 'some_name', value: '2' } } as unknown as APIGatewayProxyEvent;

    await importProductsFile(PARAMS);

    expect(logLambdaParams).toBeCalledWith('importProductsFile', PARAMS);
  });

  it('Если отсутствует queryStringParameter name, то возвращает корректную ошибку', async () => {
    const errorResponse = { statusCode: STATUS_CODES.BAD_REQUEST, body: JSON.stringify({ message: IMPORT_ERRORS.INVALID_FILE_NAME }) };

    expect(await importProductsFile({ queryStringParameters: {} } as APIGatewayProxyEvent)).toEqual(errorResponse);
  });

  it('Если queryStringParameter name присутсвует, то возвращает корректный signedUrlPromise', async () => {
    const SIGNED_URL = 'some_signed_url';
    mockGetSignedUrlPromise.mockResolvedValue(SIGNED_URL);

    const successResponse = {
      statusCode: STATUS_CODES.OK,
      headers: { ...COMMON_HEADERS },
      body: JSON.stringify({
        url: SIGNED_URL,
      }),
    };

    expect(await importProductsFile({ queryStringParameters: { name: 'products.csv' } } as unknown as APIGatewayProxyEvent)).toEqual(successResponse);
  });

  it('Если если произошла неизвестная ошибка, то возвращает корректную ошибку и логирует ее', async () => {
    mockGetSignedUrlPromise.mockRejectedValue('');

    const errorResponse = { statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR, body: JSON.stringify({ message: COMMON_ERROS.UNKNOWN }) };
    // @ts-ignore
    expect(await importProductsFile({ queryStringParameters: { name: 'products.csv' } } as APIGatewayProxyEvent)).toEqual(errorResponse);
    expect(logLambdaError).toHaveBeenCalledTimes(1);
  });
});
