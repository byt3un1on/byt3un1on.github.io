import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { IOC_PROVIDERS } from './ioc_init.ts';
import { WEB_ROUTES } from './web_routes.ts';

/** So compoe a configuracao e entrega o roteamento ja declarado em
 *  `web_routes.ts`. Sem regra propria — por isso e isento de cobertura. */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(WEB_ROUTES, withComponentInputBinding()),
    ...IOC_PROVIDERS,
  ],
};
