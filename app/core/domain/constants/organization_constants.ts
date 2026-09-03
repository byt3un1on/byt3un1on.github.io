import { SITE_ROUTES } from './site_routes_constants.ts';

/**
 * Identidade publica da organizacao e seus canais de contato (RF-10).
 *
 * Canal e um tipo somado, e nao um texto: `ready` carrega endereco, `pending`
 * carrega o motivo de ainda nao existir. Sem isso, um canal por criar viraria
 * string vazia ou endereco inventado, e a vitrine publicaria ligacao morta —
 * justamente na secao que existe para converter interesse em conversa.
 */
export interface ReadyContactChannel {
  readonly status: 'ready';
  readonly id: string;
  readonly label: string;
  readonly url: string;
  /**
   * Onde o endereco leva. O rodape decide por este campo entre navegacao do
   * roteador e ligacao para fora — inferir pelo formato do endereco seria
   * adivinhacao, e `check_links.sh` distingue os dois por `rel="noopener"`.
   */
  readonly target: 'interno' | 'externo';
}

export interface PendingContactChannel {
  readonly status: 'pending';
  readonly id: string;
  readonly label: string;
  readonly reason: string;
}

export type ContactChannel = ReadyContactChannel | PendingContactChannel;

/**
 * Convite permanente do servidor (RF-02), declarado uma unica vez.
 *
 * Mora aqui, entre os canais de contato, e nao junto da descricao do servidor:
 * o rodape precisa dele em toda pagina, e importa-lo do outro arquivo
 * arrastaria a descricao inteira do servidor para o pacote inicial.
 */
export const COMMUNITY_INVITE_URL = 'https://discord.gg/fZ3sNap5vJ';

export const ORGANIZATION = {
  name: 'Byte Union',
  login: 'byt3un1on',
  githubUrl: 'https://github.com/byt3un1on',
} as const;

export const CONTACT_CHANNELS: readonly ContactChannel[] = Object.freeze([
  {
    status: 'ready',
    id: 'github',
    label: 'Organização no GitHub',
    url: ORGANIZATION.githubUrl,
    target: 'externo',
  },
  {
    status: 'ready',
    id: 'comunidade',
    label: 'Como funciona a comunidade',
    url: SITE_ROUTES.community,
    target: 'interno',
  },
  {
    // Deixou de ser pendente quando o servidor passou a existir. O endereco e o
    // convite permanente, declarado uma unica vez em `community_space_constants`.
    status: 'ready',
    id: 'discord',
    label: 'Comunidade no Discord',
    url: COMMUNITY_INVITE_URL,
    target: 'externo',
  },
]);

/** Os unicos canais que a vitrine pode oferecer ao visitante. */
export function readyContactChannels(): readonly ReadyContactChannel[] {
  return CONTACT_CHANNELS.filter(
    (channel): channel is ReadyContactChannel => channel.status === 'ready',
  );
}

/** Os que faltam. Existe para a falta ser visivel, e nao silenciosa. */
export function pendingContactChannels(): readonly PendingContactChannel[] {
  return CONTACT_CHANNELS.filter(
    (channel): channel is PendingContactChannel => channel.status === 'pending',
  );
}
