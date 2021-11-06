export const COMMON_HEADERS = {
  "Access-Control-Allow-Headers" : "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,GET"
}

export enum COMMON_ERROS {
  UNKNOWN = 'something go wrong',
}

export enum STATUS_CODES {
  OK = 200,

  BAD_REQUEST = 400,
  NOT_FOUND = 404,

  INTERNAL_SERVER_ERROR = 500,
}

export const DEFAULT_REGION = 'eu-west-1';
