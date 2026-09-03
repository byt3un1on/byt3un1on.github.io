/**
 * O convite da comunidade e invalido, e por isso a publicacao nao acontece
 * (RF-10). A mensagem carrega o valor recebido e o formato esperado porque e
 * ela que aparece no resumo da execucao — erro generico obrigaria quem
 * acompanha a esteira a abrir log para saber o que consertar.
 */
export class CommunityInviteError extends Error {
  public constructor(
    public readonly received: string,
    public readonly expected: string,
  ) {
    super(
      `convite da comunidade invalido: recebido ${JSON.stringify(received)}, esperado ${expected}`,
    );
    this.name = 'CommunityInviteError';
  }
}
