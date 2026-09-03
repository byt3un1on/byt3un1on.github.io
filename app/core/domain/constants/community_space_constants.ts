import type { CommunityCategory } from '../models/community_channel_model.ts';
export { COMMUNITY_INVITE_URL } from './organization_constants.ts';

/**
 * O espaco de conversa da Byte Union, descrito canal a canal (RF-13).
 *
 * Este arquivo e o unico lugar onde a descricao existe (RF-12): a pagina, os
 * cenarios e o rodape leem daqui. Renomear um canal no Discord vira uma edicao
 * so — e, se a edicao nao acontecer, a divergencia aparece na revisao em vez de
 * se espalhar por textos soltos.
 *
 * A categoria fechada aparece com `channels` vazio de proposito: RF-14 manda
 * dizer que ela existe, e RF-07 proibe descrever o que ha dentro. O vazio aqui
 * nao e falta de dado, e a decisao.
 */
export const COMMUNITY_SPACE: readonly CommunityCategory[] = Object.freeze([
  Object.freeze({
    name: 'PÚBLICO',
    visibility: 'publica',
    purpose: 'Onde quem chega pela vitrine encontra a gente.',
    channels: Object.freeze([
      Object.freeze({
        name: 'boas-vindas',
        kind: 'texto',
        purpose: 'Quem somos e por onde começar. Só leitura: é referência, não conversa.',
        writable: false,
      }),
      Object.freeze({
        name: 'anúncios',
        kind: 'texto',
        purpose: 'Versões publicadas e novidades. Só leitura, para o anúncio continuar achável.',
        writable: false,
      }),
      Object.freeze({
        name: 'geral',
        kind: 'texto',
        purpose: 'Conversa aberta: dúvida sobre um projeto, ideia, apresentação. Escreva aqui.',
        writable: true,
      }),
      Object.freeze({
        name: 'Sala aberta',
        kind: 'voz',
        purpose: 'Sala de voz para quando escrever não resolve.',
        writable: true,
      }),
    ]),
  }),
  Object.freeze({
    name: 'OFICINA',
    visibility: 'fechada',
    purpose:
      'Área de trabalho de quem constrói os projetos. Fechada — por isso você vê menos canais que um membro.',
    channels: Object.freeze([]),
  }),
  Object.freeze({
    name: 'PROJETOS',
    visibility: 'publica',
    purpose: 'Um fórum por projeto, com um tópico por assunto em aberto.',
    channels: Object.freeze([
      Object.freeze({
        name: 'vitrine',
        kind: 'forum',
        purpose: 'O sítio que você está lendo: o que muda nele e por quê.',
        writable: true,
      }),
      Object.freeze({
        name: 'registro-diario',
        kind: 'forum',
        purpose: 'Ferramenta para registrar o trabalho do dia sem digitar tudo à mão.',
        writable: true,
      }),
    ]),
  }),
]);

/**
 * O que nao se resolve no Discord (RF-06). Proposta de mudanca, defeito e
 * discussao de codigo vivem onde o codigo vive: mandar a pessoa para o lugar
 * certo vale mais que recebe-la com simpatia no lugar errado.
 */
export const GITHUB_TOPICS: readonly string[] = Object.freeze([
  'proposta de mudança em um projeto',
  'defeito encontrado no código',
  'discussão sobre uma decisão técnica já implementada',
]);
