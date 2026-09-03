import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { CatalogProjectDto } from '../../../core/domain/dtos/catalog_dto.ts';
import { projectRoute } from '../../../core/domain/constants/site_routes_constants.ts';

/** RF-03: nome, resumo, tecnologias, sinal de atividade e ligacao ao repositorio. */
@Component({
  selector: 'bu-project-card',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // RF-04: o destaque da curadoria marca o item onde ele esta — sem reordenar e
  // sem redimensionar. Sao dois canais, forma e texto, porque o requisito
  // proibe que a distincao se reduza a uma palavra escrita no cartao.
  styles: [
    `
      article {
        border-left: 2px solid transparent;
        padding-left: var(--space-4);
      }

      article:has(.destaque) {
        border-left-color: var(--accent);
      }

      .destaque {
        display: inline-block;
        margin: 0 0 var(--space-2);
        font-family: var(--font-mono);
        font-size: var(--font-meta);
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--surface);
        background: var(--accent);
        border-radius: 2px;
        padding: 0 var(--space-2);
      }
    `,
  ],
  template: `
    <article>
      <h3>
        <a [routerLink]="route()">{{ project().name }}</a>
      </h3>
      @if (project().highlighted) {
        <p class="destaque">Em destaque</p>
      }
      <p>{{ project().summary }}</p>
      <ul aria-label="Tecnologias">
        @for (technology of project().technologies; track technology) {
          <li>{{ technology }}</li>
        }
      </ul>
      <p>Atividade mais recente em {{ activity() }}</p>
      <a [href]="project().repositories[0]?.url" rel="noopener">Ver o repositório</a>
    </article>
  `,
})
export class ProjectCardComponent {
  public readonly project = input.required<CatalogProjectDto>();

  protected readonly route = computed(() => projectRoute(this.project().slug));
  protected readonly activity = computed(() =>
    new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(
      new Date(this.project().lastActivityAt),
    ),
  );
}
