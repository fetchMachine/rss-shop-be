import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs';

@Injectable()
export class ProxyService {
  constructor(private httpService: HttpService) {}

  public async proxyToSerive(
    serviceName: string,
    urlToProxy: string,
    method: string,
    { data, params }: { data?: object; params?: object } = {},
  ): Promise<unknown> {
    if (!(serviceName in process.env)) {
      throw new Error('unexpected serviceName');
    }

    const productsUrl = process.env[serviceName];

    const url = [productsUrl, urlToProxy].filter(Boolean).join('/');

    return this.httpService
      .request({
        // @ts-expect-error TODO: fix typing
        method,
        url,
        ...(Object.keys(data).length && { data }),
        ...(Object.keys(params).length && { params }),
      })
      .pipe(
        catchError(e => {
          throw new HttpException(e.response.data, e.response.status);
        }),
        map((resp) => resp.data),
      );
  }
}
