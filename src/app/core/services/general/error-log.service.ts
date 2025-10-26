import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { CommonService } from '../../services/general/common.service';

@Injectable()
export class ErrorLogService {
  private name: string = 'ErrorLogService';

  constructor(private logger: NGXLogger, private commonSvc: CommonService) {}

  logError(error: any) {
    this.commonSvc.logError(error.message, error.stack.toString()).subscribe();
    if (error instanceof HttpErrorResponse) {
      console.error('There was an HTTP error.', error.message, 'Status code:', error.status);
      return 'http';
    } else if (error instanceof TypeError) {
      this.logger.error(error.message);
      console.error('There was a Type error.', error.message);
      return 'type';
    } else if (error instanceof Error) {
      this.logger.error(error.message, error);
      console.error('There was a general error.', error.message);
      return 'general';
    } else {
      this.logger.error(error.message, error);
      console.error('Nobody threw an error but something happened!', error);
      return 'dontKnow';
    }
  }
}
