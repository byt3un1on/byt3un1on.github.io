/** Desfecho da publicacao. Mora em `core` porque e conceito do dominio da
 * publicacao, e nao detalhe do comando que o transporta. */
export type PublicationOutcome = 'success' | 'failure';

/**
 * RF-16: abre a questao quando a publicacao aborta, e encerra a que estiver
 * aberta quando ela conclui. Consulta antes de abrir, para nao acumular
 * duplicata a cada aborto em sequencia.
 */
export interface IReportPublicationStatusUseCase {
  execute(outcome: PublicationOutcome, reason: string): Promise<void>;
}
