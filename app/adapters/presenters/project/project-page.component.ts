import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_ROUTES } from '../../../core/domain/constants/site_routes_constants.ts';
import { FIND_PROJECT_USE_CASE, SEO_TOOL } from '../../../infra/init/ioc_init.ts';

/** RF-07, RF-08 e RF-09: os repositorios que compoem o projeto, e o endereco
 *  publicado como ligacao distinta da do repositorio. */
@Component({
  selector: 'bu-project-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (project(); as found) {
      <article class="bu-prose">
        <h1>{{ found.name }}</h1>
        <p>{{ found.summary }}</p>
        <ul aria-label="Tecnologias">
          @for (technology of found.technologies; track technology) {
            <li>{{ technology }}</li>
          }
        </ul>
        @if (found.homepage) {
          <a [href]="found.homepage" rel="noopener">Abrir o endereco publicado</a>
        }
        <h2>Repositorios</h2>
        <ul>
          @for (repository of found.repositories; track repository.name) {
            <li>
              <a [href]="repository.url" rel="noopener">{{ repository.name }}</a>
            </li>
          }
        </ul>
      </article>
    } @else {
      <h1>Projeto nao encontrado</h1>
      <a [routerLink]="routes.catalog">Ver os projetos</a>
    }
  `,
})
export class ProjectPageComponent {
  public readonly slug = input.required<string>();

  protected readonly routes = SITE_ROUTES;
  private readonly findProject = inject(FIND_PROJECT_USE_CASE);
  private readonly seo = inject(SEO_TOOL);

  protected readonly project = computed(() => {
    const found = this.findProject.execute(this.slug());
    this.seo.apply(
      found === null ? 'Projeto nao encontrado — Byte Union' : `${found.name} — Byte Union`,
      found === null ? 'Projeto inexistente na vitrine.' : found.summary,
    );
    return found;
  });
}
