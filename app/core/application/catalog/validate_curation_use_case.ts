import type { CurationDto } from '../../domain/dtos/curation_dto.ts';
import { CurationValidationError } from '../../domain/errors/curation_validation_error.ts';
import type { IValidateCurationUseCase } from '../../../interfaces/core/application/catalog/i_validate_curation_use_case.ts';

/**
 * As tres invalidezes de RF-05. Forma do arquivo ja foi conferida pelo parser
 * do DTO; aqui e semantica, e cada uma delas impede a publicacao inteira.
 */
export class ValidateCurationUseCase implements IValidateCurationUseCase {
  public execute(curation: CurationDto, availableRepositoryNames: readonly string[]): void {
    this.rejectEntriesWithoutSummary(curation);
    this.rejectUnknownRepositories(curation, availableRepositoryNames);
    this.rejectRepeatedRepositories(curation);
  }

  private rejectEntriesWithoutSummary(curation: CurationDto): void {
    const offenders = curation.projects
      .filter((project) => project.summary.trim().length === 0)
      .map((project) => project.slug);
    if (offenders.length > 0) {
      throw new CurationValidationError('entrada sem resumo escrito', offenders);
    }
  }

  private rejectUnknownRepositories(
    curation: CurationDto,
    availableRepositoryNames: readonly string[],
  ): void {
    const available = new Set(availableRepositoryNames);
    const offenders = curation.projects.flatMap((project) =>
      project.repositories.filter((name) => !available.has(name)),
    );
    if (offenders.length > 0) {
      throw new CurationValidationError('referencia a repositorio inexistente', offenders);
    }
  }

  private rejectRepeatedRepositories(curation: CurationDto): void {
    const seen = new Set<string>();
    const offenders = new Set<string>();
    for (const project of curation.projects) {
      for (const name of project.repositories) {
        if (seen.has(name)) {
          offenders.add(name);
        }
        seen.add(name);
      }
    }
    if (offenders.size > 0) {
      throw new CurationValidationError('repositorio declarado em mais de um projeto', [
        ...offenders,
      ]);
    }
  }
}
