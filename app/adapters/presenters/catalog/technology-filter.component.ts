import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** RF-11: o criterio de restricao, com o estado atual sempre visivel. */
@Component({
  selector: 'bu-technology-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
