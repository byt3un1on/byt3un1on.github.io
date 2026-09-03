import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectCardComponent } from './project-card.component.ts';
import { TechnologyFilterComponent } from './technology-filter.component.ts';
import { CATALOG_FILTER_PARAM } from '../../../core/domain/constants/site_routes_constants.ts';
import {
  FILTER_PROJECTS_USE_CASE,
  LIST_TECHNOLOGIES_USE_CASE,
  SEO_TOOL,
} from '../../../infra/init/ioc_init.ts';

/**
 * RF-02, RF-11 e RF-13. A contagem vive em regiao viva: quem usa leitor de tela
 * ouve o resultado mudar sem perder o foco do controle de restricao.
 *
 * A restricao mora no endereco, e nao em estado interno do componente. Isso
 * torna a vista restrita compartilhavel e, sobretudo, torna o estado vazio
 * alcancavel: enquanto o filtro so oferecia tecnologias presentes no catalogo,
 * nenhum visitante conseguia chegar nele, e o ramo era codigo morto.
 */
@Component({
  selector: 'bu-catalog-page',
  standalone: true,
  imports: [ProjectCardComponent, TechnologyFilterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Projetos</h1>
    <bu-technology-filter
      [technologies]="technologies"
      [selected]="selected()"
      (selectedChange)="restrict($event)"
    />
    <p role="status" aria-live="polite">{{ announcement() }}</p>
    @if (projects().length === 0) {
      <p>Nenhum projeto atende ao critério escolhido.</p>
      <button type="button" (click)="restrict(null)">Remover a restrição</button>
    } @else {
      <div class="bu-grid">
        @for (project of projects(); track project.slug) {
          <bu-project-card [project]="project" />
        }
      </div>
    }
  `,
})
export class CatalogPageComponent {
  /** Ligada pelo roteador ao parametro de consulta, via `withComponentInputBinding`. */
  public readonly tecnologia = input<string | null>(null);

  private readonly filterProjects = inject(FILTER_PROJECTS_USE_CASE);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly technologies = inject(LIST_TECHNOLOGIES_USE_CASE).execute();
  /** Parametro ausente chega como `undefined`; o catalogo inteiro e `null`. */
  protected readonly selected = computed(() => this.tecnologia() ?? null);
  protected readonly projects = computed(() => this.filterProjects.execute(this.selected()));
  protected readonly announcement = computed(() => {
    const total = this.projects().length;
    return total === 1 ? '1 projeto encontrado' : `${total} projetos encontrados`;
  });

  constructor() {
    inject(SEO_TOOL).apply(
      'Projetos — Byte Union',
      'O que a oficina construiu, em que tecnologias, e onde está o código.',
    );
  }

  /** `null` remove o parametro do endereco, devolvendo o catalogo inteiro. */
  protected restrict(technology: string | null): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [CATALOG_FILTER_PARAM]: technology },
      queryParamsHandling: 'merge',
    });
  }
}
