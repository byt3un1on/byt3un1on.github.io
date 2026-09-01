import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooterComponent } from './site-footer.component.ts';
import { SiteHeaderComponent } from './site-header.component.ts';

/** Componente raiz: compoe o enquadramento uma vez, e nao por pagina. */
@Component({
  selector: 'bu-site-shell',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bu-site-header />
    <main id="conteudo" class="bu-container">
      <router-outlet />
    </main>
    <bu-site-footer />
  `,
})
export class SiteShellComponent {}
