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
        Nosso espaco de conversa fica no Discord. Ele existe para que quem chega pela vitrine
        consiga falar com quem escreveu o codigo — e para que a gente combine o trabalho em um lugar
        so.
      </p>

      <h2 id="organizacao">Como o servidor e organizado</h2>
      <p>
        Sao tres areas. Duas voce ve assim que entra; uma e fechada, e esta descrita abaixo pelo que
        ela e, nao pelo que tem dentro.
      </p>

      <figure>
        <img
          src="imagens/comunidade/estrutura.webp"
          width="253"
          height="400"
          alt="Barra lateral do servidor no Discord, listando as areas PUBLICO, OFICINA e PROJETOS com seus canais."
        />
        <figcaption>A barra lateral e o mapa: area, e dentro dela os canais.</figcaption>
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

      <h2 id="por-onde-comecar">Por onde comecar</h2>
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
          alt="Canal boas-vindas aberto no Discord, com a mensagem de apresentacao da Byte Union e as ligacoes para a vitrine e para o codigo."
        />
        <figcaption>A mensagem fixa de boas-vindas, com os enderecos que importam.</figcaption>
      </figure>

      <h2 id="onde-falar">Onde voce pode escrever</h2>
      <p>
        Em <strong>geral</strong>, nas salas de voz e nos foruns de projeto. Os canais
        <strong>boas-vindas</strong> e <strong>anuncios</strong> sao somente leitura: sao referencia
        e registro, e conversa no meio deles faz a informacao afundar. Reagir continua liberado.
      </p>

      <figure>
        <img
          src="imagens/comunidade/canal-anuncios.webp"
          width="560"
          height="515"
          loading="lazy"
          alt="Canal anuncios no Discord, com o aviso da versao v1.0.0 e a ligacao para a release no GitHub."
        />
        <figcaption>Em anuncios entra versao publicada e marco — e nada mais.</figcaption>
      </figure>

      <h2 id="projetos">Um forum por projeto</h2>
      <p>
        Cada projeto tem um forum, e cada assunto vira um topico com titulo. Assim a discussao de
        ontem continua achavel amanha, em vez de virar rolagem.
      </p>

      <figure>
        <img
          src="imagens/comunidade/canal-forum.webp"
          width="560"
          height="194"
          loading="lazy"
          alt="Forum de um projeto no Discord, com a lista de topicos abertos e o botao de nova publicacao."
        />
        <figcaption>Topico com titulo, e nao mensagem solta.</figcaption>
      </figure>

      <h2 id="github">O que nao se resolve aqui</h2>
      <p>
        Assunto de codigo vive onde o codigo vive. Leve para o
        <a [href]="organization.githubUrl" rel="noopener">GitHub</a>:
      </p>
      <ul>
        @for (topic of githubTopics; track topic) {
          <li>{{ topic }}</li>
        }
      </ul>

      <h2 id="entrar">Entrar</h2>
      <p>
        O convite nao expira e nao tem limite de usos. Voce entra direto, sem pedir aprovacao a
        ninguem.
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
      'Como funciona o Discord da Byte Union: o que ha em cada canal, onde falar e como entrar.',
    );
  }
}
