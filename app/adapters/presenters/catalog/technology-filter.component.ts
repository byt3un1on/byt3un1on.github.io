import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** RF-11: o criterio de restricao, com o estado atual sempre visivel. */
@Component({
  selector: 'bu-technology-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // RF-05: o criterio aplicado se distingue por fundo invertido, peso e fio
  // inferior. O fio existe porque o requisito proibe distincao so por cor —
  // ele sobrevive a daltonismo e a modo de alto contraste.
  styles: [
    `
      fieldset {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        align-items: center;
        margin-bottom: var(--space-4);
      }

      legend {
        float: left;
        width: 100%;
        margin-bottom: var(--space-2);
      }

      button[aria-pressed='true'] {
        color: var(--surface);
        background: var(--accent);
        border-color: var(--accent);
        border-bottom-width: 3px;
        border-bottom-color: var(--text);
        font-weight: 700;
      }
    `,
  ],
  template: `
    <fieldset>
      <legend>Restringir por tecnologia</legend>
      <button type="button" [attr.aria-pressed]="selected() === null" (click)="choose(null)">
        Todas
      </button>
      @for (technology of technologies(); track technology) {
        <button
          type="button"
          [attr.aria-pressed]="selected() === technology"
          (click)="choose(technology)"
        >
          {{ technology }}
        </button>
      }
    </fieldset>
  `,
})
export class TechnologyFilterComponent {
  public readonly technologies = input.required<readonly string[]>();
  public readonly selected = input.required<string | null>();
  public readonly selectedChange = output<string | null>();

  protected choose(technology: string | null): void {
    this.selectedChange.emit(technology);
  }
}
