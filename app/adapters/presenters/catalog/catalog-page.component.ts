import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ProjectCardComponent } from './project-card.component.ts';
import { TechnologyFilterComponent } from './technology-filter.component.ts';
import {
  FILTER_PROJECTS_USE_CASE,
  LIST_TECHNOLOGIES_USE_CASE,
  SEO_TOOL,
} from '../../../infra/init/ioc_init.ts';

/**
 * RF-02, RF-11 e RF-13. A contagem vive em regiao viva: quem usa leitor de tela
 * ouve o resultado mudar sem perder o foco do controle de restricao.
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
      (selectedChange)="selected.set($event)"
    />
    <p role="status" aria-live="polite">{{ announcement() }}</p>
    @if (projects().length === 0) {
      <p>Nenhum projeto atende ao criterio escolhido.</p>
      <button type="button" (click)="selected.set(null)">Remover a restricao</button>
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
  private readonly filterProjects = inject(FILTER_PROJECTS_USE_CASE);

  protected readonly technologies = inject(LIST_TECHNOLOGIES_USE_CASE).execute();
  protected readonly selected = signal<string | null>(null);
  protected readonly projects = computed(() => this.filterProjects.execute(this.selected()));
  protected readonly announcement = computed(() => {
    const total = this.projects().length;
    return total === 1 ? '1 projeto encontrado' : `${total} projetos encontrados`;
  });

  constructor() {
    inject(SEO_TOOL).apply(
      'Projetos — Byte Union',
      'O que a oficina construiu, em que tecnologias, e onde esta o codigo.',
    );
  }
}
