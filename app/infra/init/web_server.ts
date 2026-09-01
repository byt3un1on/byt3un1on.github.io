import { mergeApplicationConfig, type ApplicationRef } from '@angular/core';
import { bootstrapApplication, type BootstrapContext } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/ssr';
import { SiteShellComponent } from '../../adapters/presenters/layout/site-shell.component.ts';
import { appConfig } from './web_init.ts';

/**
 * Entrypoint que o builder usa para **renderizar em build**. Nao responde
 * requisicao, nao vai para o artefato publicado, e nenhum processo o executa em
 * producao — o Principio 7 segue intacto.
 *
 * O `BootstrapContext` e obrigatorio no servidor: sem ele o Angular 22 nao
 * encontra plataforma e falha com NG0401. A lista do que renderizar vem de
 * `data/prerender-routes.txt`, gerado por `make catalog`.
 */
export default function render(context: BootstrapContext): Promise<ApplicationRef> {
  return bootstrapApplication(
    SiteShellComponent,
    mergeApplicationConfig(appConfig, { providers: [provideServerRendering()] }),
    context,
  );
}
