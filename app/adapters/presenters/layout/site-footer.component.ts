import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ORGANIZATION,
  readyContactChannels,
} from '../../../core/domain/constants/organization_constants.ts';

/**
 * RF-10: autoria como organizacao, sem pessoa alguma, e apenas os canais que
 * de fato podem ser acionados. Canal pendente nao chega aqui — o tipo impede.
 *
 * Canal interno navega pelo roteador e externo sai com `rel="noopener"`: e o
 * campo `target` que decide, e nao o formato do endereco. `check_links.sh`
 * distingue os dois por esse atributo, entao adivinhar quebraria a medicao.
 */
@Component({
  selector: 'bu-site-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bu-container">
      <p>Mantido por {{ organization.name }}.</p>
      <nav aria-label="Contato">
        <ul>
          @for (channel of channels; track channel.id) {
            <li>
              @if (channel.target === 'interno') {
                <a [routerLink]="channel.url">{{ channel.label }}</a>
              } @else {
                <a [href]="channel.url" rel="noopener">{{ channel.label }}</a>
              }
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
