import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ORGANIZATION } from '../../../core/domain/constants/organization_constants.ts';
import { SITE_ROUTES } from '../../../core/domain/constants/site_routes_constants.ts';

@Component({
  selector: 'bu-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bu-container">
      <a class="bu-visually-hidden" href="#conteudo">Pular para o conteudo</a>
      <nav aria-label="Principal">
        <a
          [routerLink]="routes.home"
          routerLinkActive="ativo"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          {{ organization.name }}
        </a>
        <a [routerLink]="routes.catalog" routerLinkActive="ativo">Projetos</a>
        <a [routerLink]="routes.community" routerLinkActive="ativo">Comunidade</a>
      </nav>
    </header>
  `,
})
export class SiteHeaderComponent {
  protected readonly routes = SITE_ROUTES;
  protected readonly organization = ORGANIZATION;
}
