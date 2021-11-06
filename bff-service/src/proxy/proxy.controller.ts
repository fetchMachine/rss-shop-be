import { Controller, Req, Param, All } from '@nestjs/common';
import { map } from 'rxjs';
import { Request } from 'express';

import { ProxyService } from './proxy.service';

@Controller('/:service/*')
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @All()
  public async get(
    @Param() pathParams: { service: string; 0?: string },
    @Req() request: Request,
  ): Promise<unknown> {
    const service = pathParams.service.toLowerCase();
    const method = request.method;
    const { body: data = {}, query: params = {} } = request;
    const { 0: urlToProxy } = pathParams;

    try {
      return this.proxyService.proxyToSerive(service, urlToProxy, method, {
        data,
        params,
      });
    } catch {
      return 502;
    }
  }
}
