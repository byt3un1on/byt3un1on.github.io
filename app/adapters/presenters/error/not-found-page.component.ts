import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_ROUTES } from '../../../core/domain/constants/site_routes_constants.ts';
import { SEO_TOOL } from '../../../infra/init/ioc_init.ts';

/** RF-12: pagina de erro do proprio sitio, com caminho de volta ao catalogo. */
@Component({
  selector: 'bu-not-found-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Endereço não encontrado</h1>
    <p>A página que você procurou não existe nesta vitrine.</p>
    <a [routerLink]="routes.catalog">Ver os projetos</a>
  `,
})
export class NotFoundPageComponent {
  protected readonly routes = SITE_ROUTES;

  constructor() {
    inject(SEO_TOOL).apply(
      'Endereço não encontrado — Byte Union',
      'A página procurada não existe na vitrine da Byte Union.',
    );
  }
}
