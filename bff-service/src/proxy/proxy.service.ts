import {
  Injectable,
  HttpException,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError, Observable, tap } from 'rxjs';
import { Cache } from 'cache-manager';

@Injectable()
export class ProxyService {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private request({
    method,
    url,
    data,
    params,
  }: {
    method: string;
    url: string;
    data?: object;
    params?: object;
  }): Observable<unknown> {
    return this.httpService
      .request({
        // @ts-expect-error TODO: fix typing
        method,
        url,
        ...(data && Object.keys(data).length && { data }),
        ...(params && Object.keys(params).length && { params }),
      })
      .pipe(
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
        map((resp) => resp.data),
      );
  }

  private async requestWithCache(
    key: string,
    config: Parameters<typeof this.request>[0],
  ) {
    const cached = await this.cacheManager.get(key);

    if (cached) {
      return cached;
    }

    return this.request(config).pipe(
      tap(async (data) => {
        const CACHE_TIME_SEC = 60 * 2;

        await this.cacheManager.set(key, data, { ttl: CACHE_TIME_SEC });
      }),
    );
  }

  private static cachedUrls = {
    products_get: true,
  };

  public async proxyToSerive(
    serviceName: string,
    urlToProxy: string,
    method: string,
    { data, params }: { data?: object; params?: object } = {},
  ): Promise<unknown> {
    if (!(serviceName in process.env)) {
      throw new Error('unexpected serviceName');
    }

    const serviceUrl = process.env[serviceName];

    const url = [serviceUrl, urlToProxy].filter(Boolean).join('/');

    const requestConfig = {
      method,
      url,
      ...(Object.keys(data).length && { data }),
      ...(Object.keys(params).length && { params }),
    };

    const requestKey = `${urlToProxy}_${method}`.toLowerCase();

    if (requestKey in ProxyService.cachedUrls) {
      return this.requestWithCache(requestKey, requestConfig);
    }

    return this.request(requestConfig);
  }
}
