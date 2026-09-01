import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ORGANIZATION,
  readyContactChannels,
} from '../../../core/domain/constants/organization_constants.ts';

/**
 * RF-10: autoria como organizacao, sem pessoa alguma, e apenas os canais que
 * de fato podem ser acionados. Canal pendente nao chega aqui — o tipo impede.
 */
@Component({
  selector: 'bu-site-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bu-container">
      <p>Mantido por {{ organization.name }}.</p>
      <nav aria-label="Contato">
        <ul>
          @for (channel of channels; track channel.id) {
            <li>
              <a [href]="channel.url" rel="noopener">{{ channel.label }}</a>
            </li>
          }
        </ul>
      </nav>
    </footer>
  `,
})
export class SiteFooterComponent {
  protected readonly organization = ORGANIZATION;
  protected readonly channels = readyContactChannels();
}
