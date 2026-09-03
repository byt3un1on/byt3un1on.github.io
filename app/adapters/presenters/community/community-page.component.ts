import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DescribeCommunitySpaceUseCase } from '../../../core/application/community/describe_community_space_use_case.ts';
import {
  COMMUNITY_INVITE_URL,
  GITHUB_TOPICS,
} from '../../../core/domain/constants/community_space_constants.ts';
import { ORGANIZATION } from '../../../core/domain/constants/organization_constants.ts';
import { CHANNEL_KIND_LABEL } from '../../../core/domain/models/community_channel_model.ts';
import { DESCRIBE_COMMUNITY_SPACE_USE_CASE, SEO_TOOL } from '../../../infra/init/ioc_init.ts';

/**
 * RF-03: explica o espaco de conversa antes de levar o visitante para dentro
 * dele. A pagina existe porque um convite solto entrega treze canais sem dizer
 * para que servem — e quem chega assim ou nao escreve, ou escreve no lugar
 * errado.
 *
 * As capturas ilustram, e nunca informam sozinhas (RF-19): tudo o que aparece
 * nelas esta dito no texto ao lado. Cada uma declara largura e altura para nao
 * empurrar o conteudo quando carrega (RNF-08), e as que ficam abaixo da dobra
 * carregam so quando chegam perto dela.
 */
@Component({
  selector: 'bu-community-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DESCRIBE_COMMUNITY_SPACE_USE_CASE, useClass: DescribeCommunitySpaceUseCase },
  ],
  template: `
    <article class="bu-prose">
      <h1>A comunidade da {{ organization.name }}</h1>
      <p>
        Nosso espaço de conversa fica no Discord. Ele existe para que quem chega pela vitrine
        consiga falar com quem escreveu o código — e para que a gente combine o trabalho em um lugar
        só.
      </p>

      <h2 id="organizacao">Como o servidor é organizado</h2>
      <p>
        São três áreas. Duas você vê assim que entra; uma é fechada, e está descrita abaixo pelo que
        ela é, não pelo que tem dentro.
      </p>

      <figure>
        <img
          src="imagens/comunidade/estrutura.webp"
          width="253"
          height="400"
          alt="Barra lateral do servidor no Discord, listando as áreas PÚBLICO, OFICINA e PROJETOS com seus canais."
        />
        <figcaption>A barra lateral é o mapa: área, e dentro dela os canais.</figcaption>
      </figure>

      @for (category of categories; track category.name) {
        <section>
          <h3>{{ category.name }}</h3>
          <p>{{ category.purpose }}</p>
          @if (category.channels.length > 0) {
            <ul>
              @for (channel of category.channels; track channel.name) {
                <li>
                  <strong>{{ channel.name }}</strong>
                  <span> ({{ kindLabel[channel.kind] }}</span>
                  @if (!channel.writable) {
                    <span>, somente leitura</span>
                  }
                  <span>) — {{ channel.purpose }}</span>
                </li>
              }
            </ul>
          }
        </section>
      }

      <h2 id="por-onde-comecar">Por onde começar</h2>
      <p>
        Entrando, leia <strong>boas-vindas</strong>: ele diz em poucas linhas o que a oficina faz e
        para onde levar cada assunto. Depois, a conversa acontece em <strong>geral</strong>.
      </p>

      <figure>
        <img
          src="imagens/comunidade/canal-boas-vindas.webp"
          width="560"
          height="515"
          loading="lazy"
          alt="Canal boas-vindas aberto no Discord, com a mensagem de apresentação da Byte Union e as ligações para a vitrine e para o código."
        />
        <figcaption>A mensagem fixa de boas-vindas, com os endereços que importam.</figcaption>
      </figure>

      <h2 id="onde-falar">Onde você pode escrever</h2>
      <p>
        Em <strong>geral</strong>, nas salas de voz e nos fóruns de projeto. Os canais
        <strong>boas-vindas</strong> e <strong>anúncios</strong> são somente leitura: são referência
        e registro, e conversa no meio deles faz a informação afundar. Reagir continua liberado.
      </p>

      <figure>
        <img
          src="imagens/comunidade/canal-anuncios.webp"
          width="560"
          height="515"
          loading="lazy"
          alt="Canal anúncios no Discord, com o aviso da versão v1.0.0 e a ligação para a release no GitHub."
        />
        <figcaption>Em anúncios entra versão publicada e marco — e nada mais.</figcaption>
      </figure>

      <h2 id="projetos">Um fórum por projeto</h2>
      <p>
        Cada projeto tem um fórum, e cada assunto vira um tópico com título. Assim a discussão de
        ontem continua achável amanhã, em vez de virar rolagem.
      </p>

      <figure>
        <img
          src="imagens/comunidade/canal-forum.webp"
          width="560"
          height="194"
          loading="lazy"
          alt="Fórum de um projeto no Discord, com a lista de tópicos abertos e o botão de nova publicação."
        />
        <figcaption>Tópico com título, e não mensagem solta.</figcaption>
      </figure>

      <h2 id="github">O que não se resolve aqui</h2>
      <p>
        Assunto de código vive onde o código vive. Leve para o
        <a [href]="organization.githubUrl" rel="noopener">GitHub</a>:
      </p>
      <ul>
        @for (topic of githubTopics; track topic) {
          <li>{{ topic }}</li>
        }
      </ul>

      <h2 id="entrar">Entrar</h2>
      <p>
        O convite não expira e não tem limite de usos. Você entra direto, sem pedir aprovação a
        ninguém.
      </p>
      <p>
        <a [href]="inviteUrl" rel="noopener">Entrar no Discord da {{ organization.name }}</a>
      </p>
    </article>
  `,
})
export class CommunityPageComponent {
  protected readonly organization = ORGANIZATION;
  protected readonly inviteUrl = COMMUNITY_INVITE_URL;
  protected readonly githubTopics = GITHUB_TOPICS;
  protected readonly kindLabel = CHANNEL_KIND_LABEL;
  protected readonly categories = inject(DESCRIBE_COMMUNITY_SPACE_USE_CASE).execute();

  constructor() {
    inject(SEO_TOOL).apply(
      'Comunidade — Byte Union',
      'Como funciona o Discord da Byte Union: o que há em cada canal, onde falar e como entrar.',
    );
  }
}
