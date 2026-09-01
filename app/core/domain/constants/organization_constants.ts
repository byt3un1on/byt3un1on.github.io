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
}

export interface PendingContactChannel {
  readonly status: 'pending';
  readonly id: string;
  readonly label: string;
  readonly reason: string;
}

export type ContactChannel = ReadyContactChannel | PendingContactChannel;

export const ORGANIZATION = {
  name: 'Byte Union',
  login: 'byt3un1on',
  githubUrl: 'https://github.com/byt3un1on',
} as const;

export const CONTACT_CHANNELS: readonly ContactChannel[] = Object.freeze([
  {
    status: 'ready',
    id: 'github',
    label: 'Organizacao no GitHub',
    url: ORGANIZATION.githubUrl,
  },
  {
    status: 'pending',
    id: 'discord',
    label: 'Comunidade no Discord',
    // Trocar por um convite sem prazo de validade quando o grupo existir.
    // Enquanto estiver pendente, nao e renderizado e o cenario de aceite de
    // RF-10 nao passa — que e o aviso de que falta canal, e nao um detalhe.
    reason: 'grupo ainda nao criado',
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
