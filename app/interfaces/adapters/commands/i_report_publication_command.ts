import type { PublicationOutcome } from '../../core/application/catalog/i_report_publication_status_use_case';

export type { PublicationOutcome };

/**
 * Comando de `make report` (RF-16). Roda **sempre**, qualquer que tenha sido o
 * desfecho, e por isso vive fora do comando de catalogo: aborto de build ou de
 * prerender tambem precisa abrir questao.
 */
export interface IReportPublicationCommand {
  execute(outcome: PublicationOutcome, reason: string): Promise<number>;
}
