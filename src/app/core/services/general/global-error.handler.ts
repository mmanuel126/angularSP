import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ErrorLogService } from '../../services/general/error-log.service';
import { NGXLogger } from 'ngx-logger'; // **** for logger

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  _globalFunctionService: any;
  constructor(
    private logger: NGXLogger,
    private errorLogService: ErrorLogService,
    private inj: Injector
  ) {
    super();
    this._globalFunctionService = inj.get(ErrorLogService);
  }
}
