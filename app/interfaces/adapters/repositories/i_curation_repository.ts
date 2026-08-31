import type { CurationDto } from '../../../core/domain/dtos/curation_dto.ts';

/** Le a curadoria versionada (RF-04). O caminho vem do `IConfigTool`. */
export interface ICurationRepository {
  read(): Promise<CurationDto>;
}
