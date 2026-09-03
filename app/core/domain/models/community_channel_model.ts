/**
 * A forma do espaco de conversa da organizacao, como a vitrine o descreve.
 *
 * Existe como modelo tipado, e nao como texto no gabarito, porque a descricao
 * precisa de um lugar unico (RF-12): renomear um canal deve ser uma edicao so.
 * E porque o compilador consegue recusar o que a prosa deixaria passar — canal
 * sem proposito escrito, ou categoria que nao diz se e publica.
 */
export type CommunityChannelKind = 'texto' | 'voz' | 'forum';

/** Se a categoria e visivel a quem chega, ou reservada a quem trabalha. */
export type CommunityCategoryVisibility = 'publica' | 'fechada';

export interface CommunityChannel {
  readonly name: string;
  readonly kind: CommunityChannelKind;
  /** Uma frase dizendo a que o canal serve. Vazio nao e aceito (RNF-06). */
  readonly purpose: string;
  /**
   * Se o visitante pode escrever ali. Canal de anuncio e de esteira sao
   * somente leitura, e RF-05 exige que isso esteja dito antes de a pessoa
   * descobrir tentando.
   */
  readonly writable: boolean;
}

export interface CommunityCategory {
  readonly name: string;
  readonly visibility: CommunityCategoryVisibility;
  readonly purpose: string;
  readonly channels: readonly CommunityChannel[];
}

/** Rotulo legivel do tipo do canal, para a pagina nao expor o termo tecnico. */
export const CHANNEL_KIND_LABEL: Readonly<Record<CommunityChannelKind, string>> = Object.freeze({
  texto: 'texto',
  voz: 'voz',
  forum: 'fórum',
});

export function isPublicCategory(category: CommunityCategory): boolean {
  return category.visibility === 'publica';
}
