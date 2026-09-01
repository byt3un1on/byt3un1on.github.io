import type { Routes } from '@angular/router';
import { CatalogPageComponent } from '../../adapters/presenters/catalog/catalog-page.component.ts';
import { HomePageComponent } from '../../adapters/presenters/home/home-page.component.ts';
import { NotFoundPageComponent } from '../../adapters/presenters/error/not-found-page.component.ts';
import { ProjectPageComponent } from '../../adapters/presenters/project/project-page.component.ts';
import { SITE_ROUTES } from '../../core/domain/constants/site_routes_constants.ts';

/**
 * A tabela de rotas. Os caminhos saem de `SITE_ROUTES` e por isso sao relativos
 * a raiz (RNF-10); nenhuma rota e escrita duas vezes no projeto.
 */
export const WEB_ROUTES: Routes = [
  { path: withoutLeadingSlash(SITE_ROUTES.home), component: HomePageComponent },
  { path: withoutLeadingSlash(SITE_ROUTES.catalog), component: CatalogPageComponent },
  { path: withoutLeadingSlash(SITE_ROUTES.project), component: ProjectPageComponent },
  { path: withoutLeadingSlash(SITE_ROUTES.notFound), component: NotFoundPageComponent },
  { path: '**', component: NotFoundPageComponent },
];

/** O Angular declara caminho sem a barra inicial; a constante a mantem porque
 *  e ela que vale como endereco publico. */
export function withoutLeadingSlash(route: string): string {
  return route.replace(/^\//, '');
}
