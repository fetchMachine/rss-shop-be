import {
  Controller,
  Req,
  Param,
  All,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

import { ProxyService } from './proxy.service';

@Controller(['/:service?', '/:service?/*?'])
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @All()
  public async get(
    @Param() pathParams: { service?: string; 0?: string },
    @Req() request: Request,
  ): Promise<unknown> {
    const service = pathParams.service?.toLowerCase();
    const method = request.method;
    const { body: data = {}, query: params = {} } = request;
    const { 0: urlToProxy } = pathParams;

    try {
      return await this.proxyService.proxyToSerive(
        service,
        urlToProxy,
        method,
        {
          data,
          params,
        },
      );
    } catch {
      throw new HttpException('Cannot process request', HttpStatus.BAD_GATEWAY);
    }
  }
}
