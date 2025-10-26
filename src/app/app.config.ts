import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { SessionMgtService } from './core/services/general/session-mgt.service';
import { OsDetectionService } from './core/services/general/os-detection.service';
import { CommonService } from './core/services/general/common.service';
import { MembersService } from './core/services/data/members.service';
import { ContactsService } from './core/services/data/contacts.service';
import { MessagesService } from './core/services/data/messages.service';
import { SettingsService } from './core/services/data/settings.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    SessionMgtService,
    OsDetectionService,
    CommonService,
    MembersService,
    ContactsService,
    MessagesService,
    SettingsService,
  ],
};
