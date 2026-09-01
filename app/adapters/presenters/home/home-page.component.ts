import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORGANIZATION } from '../../../core/domain/constants/organization_constants.ts';
import { SITE_ROUTES } from '../../../core/domain/constants/site_routes_constants.ts';
import { SEO_TOOL } from '../../../infra/init/ioc_init.ts';

/** RF-01: o que a oficina e, acima da dobra, sem exigir acao do visitante. */
@Component({
  selector: 'bu-home-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bu-prose">
      <h1>{{ organization.name }}</h1>
      <p>
        Uma oficina de projetos: construimos software de ponta a ponta e deixamos o codigo aberto
        para quem quiser usar, estudar ou contribuir.
      </p>
      <a [routerLink]="routes.catalog">Ver os projetos</a>
    </section>
  `,
})
export class HomePageComponent {
  protected readonly organization = ORGANIZATION;
  protected readonly routes = SITE_ROUTES;

  constructor() {
    inject(SEO_TOOL).apply(
      'Byte Union — oficina de projetos',
      'O que a Byte Union constroi, em que tecnologias, e onde esta o codigo.',
    );
  }
}
