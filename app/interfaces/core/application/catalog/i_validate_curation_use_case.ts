import type { CurationDto } from '../../../../core/domain/dtos/curation_dto';

/**
 * As tres invalidezes de RF-05: entrada sem resumo escrito, referencia a
 * repositorio inexistente na organizacao, e repositorio declarado em mais de um
 * projeto. Lanca `CurationValidationError`; nao devolve booleano, porque
 * curadoria invalida impede a publicacao e nao admite continuar.
 *
 * Forma do arquivo ja foi conferida pelo parser do DTO. Aqui e semantica.
 */
export interface IValidateCurationUseCase {
  execute(curation: CurationDto, availableRepositoryNames: readonly string[]): void;
}
