export const COMMON_HEADERS = {
  "Access-Control-Allow-Headers" : "Content-Type",
  "Access-Control-Allow-Origin": "https://dzfkk71q2g2nw.cloudfront.net",
  "Access-Control-Allow-Methods": "OPTIONS,GET"
}

export enum ERROS {
  PRODUCT_NOT_FOUNDED = 'product not founded',
  INVALID_ID = 'invalid product id',
  INVALID_BODY = 'invalid product',
  UNKNOWN = 'something go wrong',
}

export enum STATUS_CODES {
  OK = 200,

  BAD_REQUEST = 400,
  NOT_FOUND = 404,

  INTERNAL_SERVER_ERROR = 500,
}
