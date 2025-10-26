import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionMgtService } from '../../services/general/session-mgt.service';

@Injectable()
export class StateService {
  public unReadMessages = new BehaviorSubject('UnReadeMessages');

  constructor(public session: SessionMgtService) {}

  setUnReadMessages(msgCnt: string) {
    this.unReadMessages.next(msgCnt);
  }
}
