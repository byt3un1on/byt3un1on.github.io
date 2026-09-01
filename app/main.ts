import { bootstrapApplication } from '@angular/platform-browser';
import { SiteShellComponent } from './adapters/presenters/layout/site-shell.component.ts';
import { appConfig } from './infra/init/web_init.ts';

// Pede o inicializador e executa. Sem regra de negocio.
await bootstrapApplication(SiteShellComponent, appConfig);
